import React from 'react';

export default class MainMap extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

        this.leafLetMap = L.map('mainMap');
        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(this.leafLetMap);

        //geolocation
        //first location and setting the view
        this.leafLetMap.locate({setView: true, maxZoom: 16});

        //continous watching to redraw the marker
        this.leafLetMap.on('locationfound', onLocationFound.bind(this));

        const markers = L.markerClusterGroup();

        //marker and popup
        this.props.locations.forEach((location)=> {

            //@todo: use a small template
            const title = location.usageTerm + ' (' + location.constructionYear + ')'
                + '<br/>' + location.originalId
                + '<br/><a href="' + location.originalUrl + '">' + location.originalUrl + '</a>';

            //Leaflet is using (north, east) or (latLng), but the backend stores it in the more common (east, north) or (lngLat) format
            const marker = L.marker(location.location.coordinates.reverse(), {alt: title});
            const popup = L.popup({closeButton: false}).setContent(title);

            marker.bindPopup(popup);
            //     marker.addTo(this.leafLetMap);

            markers.addLayer(marker);
            this.leafLetMap.addLayer(markers);
        });


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

    const radius = geoData.accuracy / 2;

    //if there is already a usermarker update it
    if (this.userMarker) {
        this.userMarker.marker.setLatLng(geoData.latlng);
        this.userMarker.circle.setLatLng(geoData.latlng);
        this.userMarker.circle.setRadius(radius);
        return;
    }

    //create users position on Map
    this.userMarker =
    {
        marker: L.marker(geoData.latlng).addTo(this.leafLetMap),
        circle: L.circle(geoData.latlng, {radius}).addTo(this.leafLetMap)

    };
}