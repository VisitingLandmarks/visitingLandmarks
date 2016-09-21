import React from 'react';

export default class MainMap extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('didMount', this.props);
        var map = L.map('mainMap');
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);
        map.locate({setView: true, maxZoom: 16});
        console.time('marker');
         this.props.locations.forEach((location)=> {

             //Leaflet is using (north, east) or (latLng), but the backend stores it in the more common (east, north) or (lngLat) format
             L.marker(location.location.coordinates.reverse()).addTo(map);
         });
        console.timeEnd('marker');

    }

    render() {
        console.log('render');
        return <div id="mainMap"></div>;
    }
}