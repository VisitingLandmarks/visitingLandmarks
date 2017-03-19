import React, {PropTypes} from 'react';
import gameSettings from '../../config/gameSettings';
import markerStyle from '../client/map/markerStyle';
import orientationToCompassHeading from '../modules/orientationToCompassHeading';
import antiHammer from '../modules/antiHammer';
const memoize = require('memoizee');
// import {log} from  '../../client/toServer';


/**
 * translate numerical coordinates to leafLet Map coordinates
 */
const getLatLng = memoize((coordinates) => {
    return L.latLng(coordinates[1], coordinates[0]);
});


/**
 * the map
 */
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

        require('leaflet-rotatedmarker');

        this.leafLetMap = L.map('mainMap', {
            dragging: !this.props.followUser, //this could also be done with the setUserInteractivity method
            doubleClickZoom: false,
            scrollWheelZoom: 'center',
            touchZoom: 'center',
        });

        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(this.leafLetMap);

        //geoLocation
        //continuously watching to redraw the marker
        this.leafLetMap.on('locationfound', antiHammer(onLocationFound.bind(this)));

        //get event for orie
        window.addEventListener('deviceorientation', antiHammer(onDeviceOrientation.bind(this)), false);

        //first location and setting the view
        this.leafLetMap.locate({setView: true, enableHighAccuracy: true, maxZoom: 16});

        //trigger the initial creation of markers
        const markerClusterGroup = createMarkersAndCluster(this.props.locations, this.marker, this.popups, this.props.onToggleFollowUser);

        //ensure that the follow user is switched off, when a user clicks on a cluster
        const onMapMove = () => this.props.onToggleFollowUser(false);
        markerClusterGroup.on('clusterclick', onMapMove);
        this.leafLetMap.on('popupopen', onMapMove);

        this.leafLetMap.addLayer(markerClusterGroup);

        this.updateMarkers();
    }


    /**
     * set the orientation arrow
     * @param deg
     */
    updateOrientationMarker(deg) {

        let best = deg;

        if (this.userMarker.arrow.lastValue !== undefined) {

            //handle multiple rotations in one direction
            best = best + 360 * Math.floor(this.userMarker.arrow.lastValue / 360);

            //get the closest rotation variation
            const minus360 = best - 360;
            const plus360 = best + 360;

            best = [best, minus360, plus360].sort((a, b) => {
                return Math.abs(a - this.userMarker.arrow.lastValue) - Math.abs(b - this.userMarker.arrow.lastValue);
            })[0];

        }

        this.userMarker.arrow.setRotationAngle(best);

        //only on first run
        if (this.userMarker.arrow.lastValue === undefined) {
            this.userMarker.arrow.setOpacity(1);
        }

        this.userMarker.arrow.lastValue = best;
    }


    /**
     * update all markers on the map
     */
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
 * create the markers and popups
 * @param self
 */
function createMarkersAndCluster(locations, marker, popups) {


    const markers = Object.keys(locations)
        .map((locationId) => {

            const location = locations[locationId];
            const buildMarker = marker[locationId] = L.marker(getLatLng(location.location.coordinates));

            popups[locationId] = L.popup({closeButton: false});
            buildMarker.bindPopup(popups[locationId]);

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
        .forEach((locationId) => {

            const location = locations[locationId];
            const userVisit = visitedLocations[locationId];

            if (userVisit) {
                marker[locationId].setIcon(markerStyle.visited);
            }

            const title = `${location.usageTerm}<br/>
                ${(location.originalUrl ? `<a href="${location.originalUrl}">` : '')}
                ${location.name}${(location.originalUrl ? ' (' + location.constructionYear + ')' : '')}<br/>
                ${(location.originalUrl ? '</a>' : '')}
                ${location.extent}<br/>
                visited already: ${(visitedLocations[locationId] ? visitedLocations[locationId] : 'No')}`;

            popups[locationId].setContent(title);

        });

}


/**
 * allow or disallow the user to move on the map
 * @param map
 * @param userIsAllowedToMoveMap
 */
function setUserInteractivity(map, userIsAllowedToMoveMap) {
    map.dragging[userIsAllowedToMoveMap ? 'enable' : 'disable']();
}


/**
 * handle the device orientation
 * @param e
 */
function onDeviceOrientation(e) {

    //checking for null and undefined in one check using ==
    if (e.webkitCompassHeading == null && !e.absolute || //if absolute is false, null or undefined stop here
        e.alpha == null ||
        e.beta == null ||
        e.gamma == null

    ) {
        return;
    }

    this.updateOrientationMarker(e.webkitCompassHeading || orientationToCompassHeading(e.alpha, e.beta, e.gamma));
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
            circle: L.circle(geoData.latlng, {radius}).addTo(this.leafLetMap),
        };
    }

    //here comes the logic to check that we are near a building.
    //iterate over all locations
    Object.keys(component.props.locations)
    //find all close locations that are not collected by the user yet
        .filter((locationId) => {

            const location = component.props.locations[locationId];
            const latLng = getLatLng(location.location.coordinates);

            //distance is in meters and we want everything that is as 50m close to the user
            return !component.props.visitedLocations[locationId] &&
                latLng &&
                (Math.abs(geoData.latlng.lat - latLng.lat) < gameSettings.visitDistance.lat) &&
                (Math.abs(geoData.latlng.lng - latLng.lng) < gameSettings.visitDistance.lng) &&
                latLng.distanceTo(geoData.latlng) <= gameSettings.visitDistance.meters;
        })

        //and mark them as visited
        .forEach(component.props.onVisitLocation);
}

MainMap.propTypes = {
    followUser: PropTypes.bool.isRequired,
    locations: PropTypes.object.isRequired,
    onToggleFollowUser: PropTypes.func.isRequired,
    visitedLocations: PropTypes.object.isRequired,
};

