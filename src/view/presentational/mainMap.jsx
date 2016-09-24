import React from 'react';

export default class MainMap extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('didMount', this.props);
        this.leafLetMap = L.map('mainMap');
        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(this.leafLetMap);

        //geolocation
        //first location and setting the view
        this.leafLetMap.locate({setView: true, maxZoom: 16});

        //continous watching to redraw the marker
        this.leafLetMap.on('locationfound', onLocationFound.bind(this));

        //marker and popup
        this.props.locations.forEach((location)=> {

            const title = location.usageTerm + ' (' + location.constructionYear + ')';
            //Leaflet is using (north, east) or (latLng), but the backend stores it in the more common (east, north) or (lngLat) format
            const marker = L.marker(location.location.coordinates.reverse(), {title, alt: title});
            const popup = L.popup({closeButton: false}).setContent(title);

            marker.bindPopup(popup);
            marker.addTo(this.leafLetMap);
        });

    }

    render() {
        console.log('render');
        return <div id="mainMap"></div>;
    }
}

/**
 * display a marker and circle for the users position
 * @param e
 */
function onLocationFound(e) {
    console.log('onLocation');

    //go to watching mode for geolocation
    if (!this.isGeoWatching) {
        this.leafLetMap.locate({watch: true});
        this.isGeoWatching = true;
    }

    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(this.leafLetMap);
    L.circle(e.latlng, radius).addTo(this.leafLetMap);
}