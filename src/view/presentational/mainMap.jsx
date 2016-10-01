import React from 'react';
import config from '../../../config/index.js';

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
        updateMarkers(this.props.locations, this.popups);

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

    const markers = Object.values(self.props.locations)
        .map((location)=> {

                const title = `${location.originalId} (${location.constructionYear })<br/>
                <a href="${location.originalUrl}">${location.originalUrl}</a><br/>
                visited already: ${location.visited}`;
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
function updateMarkers(locations, popups) {

    Object.values(locations)
        .forEach((location)=> {

                const title = `${location.originalId} (${location.constructionYear })<br/>
                <a href="${location.originalUrl}">${location.originalUrl}</a><br/>
                visited already: ${location.visited}`;

                popups[location.originalId].setContent(title);

            }
        );
}


/**
 * display a marker and circle for the users position
 * @param geoData
 */
function onLocationFound(geoData) {

    //go to watching mode
    if (!this.isGeoWatching) {
        this.leafLetMap.locate({watch: true});
        this.isGeoWatching = true;
    }

    //radius is per definition of geolocation half the accuracy
    const radius = geoData.accuracy / 2;

    //iterate over all locations
    Object.keys(this.props.locations)
    //find all close locations that are not collected by the user yet
        .filter((locationId)=> {
            const location = this.props.locations[locationId];

            //distance is in meters and we want everything that is as 50m close to the user
            return !location.visited &&
                this.latLng &&
                this.latLng[location.originalId] &&
                //@todo: calcute first the easier difference between lat and lng before handling to the more complex algorithm
                (Math.abs(geoData.latlng.lat - this.latLng[location.originalId].lat) < config.game.visitDistance.lat) &&
                (Math.abs(geoData.latlng.lng - this.latLng[location.originalId].lng) < config.game.visitDistance.lng) &&
                this.latLng[location.originalId].distanceTo(geoData.latlng) <= config.game.visitDistance.meters;
        })
        //and mark them as visited
        .forEach(this.props.onVisitLocation);

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


