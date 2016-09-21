import React from 'react';

export default class MainMap extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('didMount', this.props);
        this.leafLetMap = L.map('mainMap');
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.leafLetMap);

        //geolocation
        this.leafLetMap.locate({watch: true, setView: true, maxZoom: 16});
        this.leafLetMap.on('locationfound', onLocationFound.bind(this.leafLetMap));

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
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(this);
    L.circle(e.latlng, radius).addTo(this);
}