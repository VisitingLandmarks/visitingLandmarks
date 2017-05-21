/* global L */

/**
 * definition of markers used in the application
 */
export default module.exports = (typeof L === 'undefined' ? {} : {
    user: L.icon({
        iconUrl: '/static/img/marker/user.png',
        iconRetinaUrl: '/static/img/marker/user-2x.png',
        shadowUrl: '/static/img/marker/shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [11, 41],
        iconSize: [64, 64],
        iconAnchor: [32, 64],
        popupAnchor: [32, -10],
    }),
    arrow: L.icon({
        iconUrl: '/static/img/marker/arrow.png',
        iconRetinaUrl: '/static/img/marker/arrow-2x.png',
        iconSize: [32, 32],
        iconAnchor: [16, 100],
        popupAnchor: [0, 0],
    }),
    visited: L.icon({
        iconUrl: '/static/img/marker/grey.png',
        iconRetinaUrl: '/static/img/marker/grey-2x.png',
        shadowUrl: '/static/img/marker/shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    }),
});
