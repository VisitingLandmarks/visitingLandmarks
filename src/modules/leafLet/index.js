export default () => {
    if (typeof L === 'undefined') {
        require('leaflet');
        require('leaflet-rotatedmarker');
        require('leaflet.markercluster');
    }

    return L;
};
