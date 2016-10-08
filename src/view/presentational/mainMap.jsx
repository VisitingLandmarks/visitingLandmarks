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

        this.leafLetMap = L.map('mainMap');
        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(this.leafLetMap);

        //geolocation
        //first location and setting the view
        this.leafLetMap.locate({setView: true, maxZoom: 16});

        //continous watching to redraw the marker
        this.leafLetMap.on('locationfound', onLocationFound.bind(this));

        //trigger the initial creation of markers
        createMarkers(this);
    }

    /**
     * called when the component is updated with different properties
     */
    componentDidUpdate() {
        updateMarkers(this.props.locations, this.props.visitedlocations, this.popups);

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
    self.popups = {};
    self.latLng = {};

    const markers = Object.keys(self.props.locations)
        .map((locationId)=> {

                const location = self.props.locations[locationId];
                const title = `${location.originalId} (${location.constructionYear })<br/>
                <a href="${location.originalUrl}">${location.originalUrl}</a><br/>
                visited already: ${self.props.visitedlocations[locationId]}`;
                self.latLng[location.originalId] = L.latLng(location.location.coordinates.reverse());
                const marker = L.marker(self.latLng[location.originalId]);
                self.popups[location.originalId] = L.popup({closeButton: false}).setContent(title);
                marker.bindPopup(self.popups[location.originalId]);
                return marker;

            }
        );

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
function updateMarkers(locations, visitedlocations, popups) {

    Object.keys(locations)
        .forEach((locationId)=> {

                const location = locations[locationId];
                const title = `${location.originalId} (${location.constructionYear })<br/>
                <a href="${location.originalUrl}">${location.originalUrl}</a><br/>
                visited already: ${visitedlocations[locationId]}`;

                popups[location.originalId].setContent(title);

            }
        );

}

/**
 * display a marker and circle for the users position
 * @param geoData
 */
function onLocationFound(geoData) {

    const component = this;

    //allow calling this function again without having the geoData -> to handle user login, when near a building
    onLocationFound.lastData = function() {
        onLocationFound.call(component, geoData);
    }

    //go to watching mode
    if (!this.isGeoWatching) {
        this.leafLetMap.locate({watch: true});
        this.isGeoWatching = true;
    }


    //radius is per definition of geolocation half the accuracy
    const radius = geoData.accuracy / 2;

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

    //if there is already a user marker update it
    if (this.userMarker) {
        this.userMarker.marker.setLatLng(geoData.latlng);
        this.userMarker.circle.setLatLng(geoData.latlng);
        this.userMarker.circle.setRadius(radius);
        return;
    }

    //create users position on Map
    this.userMarker = {
        marker: L.marker(geoData.latlng).addTo(this.leafLetMap),
        circle: L.circle(geoData.latlng, {radius}).addTo(this.leafLetMap)
    };
}


