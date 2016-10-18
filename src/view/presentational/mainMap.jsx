import React from 'react';
import gameSettings from '../../../config/gameSettings';
export default class MainMap extends React.Component {
    constructor(props) {
        super(props);
    }


    /**
     * execute once, when react adds the element to dom
     * the typical way to connect a "non" react component in a larger react project
     */
    componentDidMount() {

        this.leafLetMap = L.map('mainMap', {
            dragging: !this.props.followUser, //this could also be done with the setUserInteractivity method
            doubleClickZoom: false,
            scrollWheelZoom: 'center',
            touchZoom: 'center'
        });

        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(this.leafLetMap);

        this.markerStyle = {
            user: L.icon({
                iconUrl: '/static/img/marker/user.png',
                iconRetinaUrl: '/static/img/marker/user-2x.png',
                shadowUrl: '/static/img/marker/shadow.png',
                shadowSize: [41, 41],
                shadowAnchor: [11, 41],
                iconSize: [64, 64],
                iconAnchor: [32, 64],
                popupAnchor: [32, -10]
            }),
            visited: L.icon({
                iconUrl: '/static/img/marker/grey.png',
                iconRetinaUrl: '/static/img/marker/grey-2x.png',
                shadowUrl: '/static/img/marker/shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        };

        //geolocation
        //continuously watching to redraw the marker
        this.leafLetMap.on('locationfound', onLocationFound.bind(this));

        //first location and setting the view
        this.leafLetMap.locate({setView: true, enableHighAccuracy: true, maxZoom: 16});

        //trigger the initial creation of markers
        createMarkers(this);
    }


    /**
     * called when the component is updated with different properties
     */
    componentDidUpdate() {

        updateMarkers(this.props.locations, this.props.visitedlocations, this.marker, this.markerStyle, this.popups);

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
 * create the markers and store a reference to the popups and the precalculated latLng for later
 * @param self
 */
function createMarkers(self) {

    //marker and popup
    self.marker = {};
    self.popups = {};
    self.latLng = {};

    const markers = Object.keys(self.props.locations)
        .map((locationId)=> {

            const location = self.props.locations[locationId];
            const userVisit = self.props.visitedlocations[locationId];
            self.latLng[location.originalId] = L.latLng(location.location.coordinates.reverse());
            const marker = self.marker[location.originalId] = L.marker(self.latLng[location.originalId]);

            if (userVisit) {
                marker.setIcon(self.markerStyle.visited);
            }

            const title = `${location.originalId} (${location.constructionYear })<br/>
                <a href="${location.originalUrl}">${location.originalUrl}</a><br/>
                ${JSON.stringify(location.location)}<br/>
                visited already: ${userVisit}`;

            self.popups[location.originalId] = L.popup({closeButton: false}).setContent(title);
            marker.bindPopup(self.popups[location.originalId]);

            return marker;

        });

    //create the cluster layer and add the markers
    const markerClusterGroup = L.markerClusterGroup();
    markerClusterGroup.addLayers(markers);
    self.leafLetMap.addLayer(markerClusterGroup);
}


/**
 * update the markers on the map
 * @todo right now this just works for the title, not coordinations, removing or adding locations
 * @param self
 */
function updateMarkers(locations, visitedlocations, marker, markerStyle, popups) {

    Object.keys(locations)
        .forEach((locationId)=> {

            const location = locations[locationId];

            const userVisit = visitedlocations[locationId];

            if (userVisit) {
                marker[location.originalId].setIcon(markerStyle.visited);
            }

            const title = `${location.originalId} (${location.constructionYear })<br/>
                <a href="${location.originalUrl}">${location.originalUrl}</a><br/>
                ${JSON.stringify(location.location)}<br/>
                visited already: ${visitedlocations[locationId]}`;

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
        this.userMarker.circle.setLatLng(geoData.latlng);
        this.userMarker.circle.setRadius(radius);

    } else {//create users position on Map, if not exist yet
        this.userMarker = {
            marker: L.marker(geoData.latlng, {icon: this.markerStyle.user}).addTo(this.leafLetMap),
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
            return !component.props.visitedlocations[locationId] &&
                component.latLng &&
                component.latLng[location.originalId] &&
                (Math.abs(geoData.latlng.lat - component.latLng[location.originalId].lat) < gameSettings.visitDistance.lat) &&
                (Math.abs(geoData.latlng.lng - component.latLng[location.originalId].lng) < gameSettings.visitDistance.lng) &&
                component.latLng[location.originalId].distanceTo(geoData.latlng) <= gameSettings.visitDistance.meters;
        })
        //and mark them as visited
        .forEach(component.props.onVisitLocation);
}


