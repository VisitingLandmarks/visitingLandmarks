import React from 'react';

export default class MainMap extends React.Component {
    componentDidMount() {
        var map = L.map('mainMap');
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);
        map.locate({setView: true, maxZoom: 16});
    }
    render() {
        return <div id="mainMap"></div>;
    }
}