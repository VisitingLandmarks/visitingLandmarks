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

        //marker and popup
        const markers = L.markerClusterGroup();
        Object.values(this.props.locations)
            .forEach((location)=> {

                const title = `${location.originalId} (${location.constructionYear })<br/>
                <a href="${location.originalUrl}">${location.originalUrl}</a><br/>
                visited already: ${location.visited}`;

                //add a latLng property to the location, so that we can calculate distances
                location.latLng = L.latLng(location.location.coordinates.reverse());

                //Leaflet is using (north, east) or (latLng), but the backend stores it in the more common (east, north) or (lngLat) format
                const marker = L.marker(location.latLng, {alt: title});
                const popup = L.popup({closeButton: false}).setContent(title);

                marker.bindPopup(popup);
                markers.addLayer(marker);
            });

        this.leafLetMap.addLayer(markers);
    }

    render() {
        return <div id="mainMap"></div>;
    }
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

    console.time('calculateDistance TO all points');

    //iterate over all locations
    Object.keys(this.props.locations)
    //find all close locations that are not collected by the user yet
        .filter((locationId)=> {
            const location = this.props.locations[locationId];

            //distance is in meters and we want everything that is as 50m close to the user
            //@todo: this algorithm is relative heavy. There is maybe a faster implementation by filtering the locations by lat,lng just on a numerical basis
            return !location.visited && location.latLng.distanceTo(geoData.latlng) <= config.game.visitDistance;
        })
        //and mark them as visited
        .forEach(this.props.onVisitLocation);

    console.timeEnd('calculateDistance TO all points');

    //if there is already a usermarker update it
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


