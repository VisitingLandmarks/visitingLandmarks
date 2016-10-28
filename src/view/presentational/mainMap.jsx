import React from 'react';
import gameSettings from '../../../config/gameSettings';
import markerStyle from '../../client/map/markerStyle';

export default class MainMap extends React.Component {
    constructor(props) {
        super(props);

        //marker and popup
        this.marker = {};
        this.popups = {};
        this.latLng = {};

        this.updateOrientationMarker = this.updateOrientationMarker.bind(this);
        this.updateMarkers = this.updateMarkers.bind(this);

    }


    /**
     * execute once, when react adds the element to dom
     * the typical way to connect a "non" react component in a larger react project
     */
    componentDidMount() {

        const component = this;
        require('leaflet-rotatedmarker');

        this.leafLetMap = L.map('mainMap', {
            dragging: !this.props.followUser, //this could also be done with the setUserInteractivity method
            doubleClickZoom: false,
            scrollWheelZoom: 'center',
            touchZoom: 'center'
        });

        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(this.leafLetMap);

        //geolocation
        //continuously watching to redraw the marker
        this.leafLetMap.on('locationfound', onLocationFound.bind(this));

        // orientation Events

// device APIs are available
        function onDeviceReady() {
            console.log('ready');
            window.removeEventListener('deviceorientation', onDeviceOrientation, false);
            navigator.compass.getCurrentHeading(onSuccess, onError);
        }

// onSuccess: Get the current heading
        function onSuccess(heading) {
            console.log('Heading: ' + heading.magneticHeading);
            component.updateOrientationMarker(heading.magneticHeading);
        }

// onError: Failed to get the heading
        function onError(compassError) {
            console.log('Compass Error: ' + compassError.code);
        }

        function onDeviceOrientation(e) {
            console.log('onDeviceOrientation', e);
            let alpha = e.webkitCompassHeading || e.absolute && e.alpha;

            if (typeof alpha !== 'number') {
                return;
            }

            //normalize from -180/180 to 0/360
            alpha = (alpha + 360) % 360;

            component.updateOrientationMarker(alpha);
        }

        //native browsers
        window.addEventListener('deviceorientation', onDeviceOrientation, false);

        //PhoneGap
        document.addEventListener('deviceready', onDeviceReady, false);

        //first location and setting the view
        this.leafLetMap.locate({setView: true, enableHighAccuracy: true, maxZoom: 16});

        //build coordiantes
        createCoordinates(this.latLng, this.props.locations);

        //trigger the initial creation of markers
        this.leafLetMap.addLayer(createMarkers(this, this.props.locations, this.latLng, this.marker, this.popups));
        this.updateMarkers();
    }

    updateOrientationMarker(deg) {
        this.userMarker.arrow.setRotationAngle(deg).setOpacity(1);
    }

    updateMarkers() {
        updateMarkers(this.props.locations, this.props.visitedLocations, this.marker, this.popups);
    }


    /**
     * called when the component is updated with different properties
     */
    componentDidUpdate() {

        this.updateMarkers();

        setUserInteractivity(this.leafLetMap, !this.props.followUser);

        //recheck buildings
        if (onLocationFound.lastData) {
            onLocationFound.lastData();
        }

    }

    render() {
        return <div id="mainMap"></div>;
    }
}


/**
 * create the leaflet coordidantes based on native coordinates
 * @param latLng
 * @param locations
 */
const createCoordinates = (latLng, locations) => {
    Object.keys(locations)
        .forEach((locationId) => {
            const location = locations[locationId];
            latLng[location.originalId] = L.latLng(location.location.coordinates.reverse());
        });
};


/**
 * create the markers and store a reference to the popups and the precalculated latLng for later
 * @param self
 */
function createMarkers(self, locations, latLng, marker, popups) {

    const markers = Object.keys(locations)
        .map((locationId) => {

            const location = locations[locationId];
            const buildMarker = marker[location.originalId] = L.marker(latLng[location.originalId]);

            popups[location.originalId] = L.popup({closeButton: false});
            buildMarker.bindPopup(popups[location.originalId]);

            return buildMarker;

        });

    //create the cluster layer and add the markers
    const markerClusterGroup = L.markerClusterGroup();
    markerClusterGroup.addLayers(markers);

    return markerClusterGroup;
}


/**
 * update the markers on the map
 * @todo right now this just works for the title, not coordinations, removing or adding locations
 * @param self
 */
function updateMarkers(locations, visitedLocations, marker, popups) {

    Object.keys(locations)
        .forEach((locationId)=> {

            const location = locations[locationId];
            const userVisit = visitedLocations[locationId];

            if (userVisit) {
                marker[location.originalId].setIcon(markerStyle.visited);
            }

            const title = `${location.originalId} (${location.constructionYear })<br/>
                <a href="${location.originalUrl}">${location.originalUrl}</a><br/>
                ${JSON.stringify(location.location)}<br/>
                visited already: ${visitedLocations[locationId]}`;

            popups[location.originalId].setContent(title);

        });

}


/**
 * allow or disallow the user to move on the map
 * @param map
 * @param userIsAllowedToMoveMap
 */
function setUserInteractivity(map, userIsAllowedToMoveMap) {
    if (userIsAllowedToMoveMap) {
        map.dragging.enable();
    } else {
        map.dragging.disable();

    }
}


/**
 * display a marker and circle for the users position
 * @param geoData
 */
function onLocationFound(geoData) {

    const component = this;

    //allow calling this function again without having the geoData
    // - the switch "follow user"
    // - user logs in and the position check needs to be redone
    // component.lateastGeoData = geoData;
    onLocationFound.lastData = () => {
        onLocationFound.call(component, geoData);
    };

    //go to watching mode
    if (!component.isGeoWatching) {
        component.leafLetMap.locate({watch: true});
        component.isGeoWatching = true;
    }

    //follow user
    if (component.props.followUser) {
        component.leafLetMap.panTo(geoData.latlng);
    }

    //radius is per definition of geolocation half the accuracy
    const radius = geoData.accuracy / 2;

    //if there is already a user marker update it
    if (this.userMarker) {
        this.userMarker.marker.setLatLng(geoData.latlng);
        this.userMarker.arrow.setLatLng(geoData.latlng);
        this.userMarker.circle.setLatLng(geoData.latlng);
        this.userMarker.circle.setRadius(radius);

    } else { //create users position on Map, if not exist yet
        this.userMarker = {
            marker: L.marker(geoData.latlng, {icon: markerStyle.user}).addTo(this.leafLetMap),
            arrow: L.marker(geoData.latlng, {icon: markerStyle.arrow}).addTo(this.leafLetMap).setOpacity(0),
            circle: L.circle(geoData.latlng, {radius}).addTo(this.leafLetMap)
        };
    }

    //here comes the logic to check that we are near a building.
    //iterate over all locations
    Object.keys(component.props.locations)
    //find all close locations that are not collected by the user yet
        .filter((locationId)=> {

            const location = component.props.locations[locationId];
            //distance is in meters and we want everything that is as 50m close to the user
            return !component.props.visitedLocations[locationId] &&
                component.latLng &&
                component.latLng[location.originalId] &&
                (Math.abs(geoData.latlng.lat - component.latLng[location.originalId].lat) < gameSettings.visitDistance.lat) &&
                (Math.abs(geoData.latlng.lng - component.latLng[location.originalId].lng) < gameSettings.visitDistance.lng) &&
                component.latLng[location.originalId].distanceTo(geoData.latlng) <= gameSettings.visitDistance.meters;
        })
        //and mark them as visited
        .forEach(component.props.onVisitLocation);
}



