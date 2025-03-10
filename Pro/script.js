var map;
var startMarker = null;
var endMarker = null;
var currMarker = null;
const btn = document.querySelector("#btn");

function Map() {
    map = L.map('map').setView([17.3850, 78.4867], 6);

    // Tile Layer - OpenStreetMap
    const osmTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Tile Layer - Satellite (Example with Esri)
    const satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    });

    // Layer control for switching between different tile layers
    L.control.layers({
        "OpenStreetMap": osmTileLayer,
        "Satellite": satelliteTileLayer
    }).addTo(map);

    // Adding a search bar
    const { GeoSearchControl, OpenStreetMapProvider } = window.GeoSearch;
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
        provider: provider,
        style: 'bar',
        autoClose: true,
        searchLabel: 'Search for a place...'
    });

    map.addControl(searchControl);

    // Current Location Button
    var button = L.control({ position: 'bottomleft' });

    button.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'currbtn');
        div.innerHTML = '<button>Current Location</button>';
        div.querySelector('button').onclick = function () {
            map.locate({
                setView: true,
                maxZoom: 10
            });
        };
        return div;
    };

    button.addTo(map);

    map.on('locationfound', function (e) {
        var latlng = e.latlng;
        if (currMarker) {
            map.removeLayer(currMarker); // Remove existing marker
        }
        currMarker = L.marker(latlng).addTo(map).bindPopup("You are here").openPopup();
    });
}

const mark = (ee) => {
    if (!startMarker) {
        startMarker = L.marker(ee).addTo(map);
        startMarker.bindPopup("Start Location").openPopup();
    }
    else if (!endMarker) {
        endMarker = L.marker(ee).addTo(map);
        endMarker.bindPopup("End Location").openPopup();
        getRoute();
    }
};

let routingControl;

function getRoute() {
    let start = startMarker.getLatLng();
    let end = endMarker.getLatLng();
    if (routingControl) {
        map.removeControl(routingControl);
    }

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(start.lat, start.lng),
            L.latLng(end.lat, end.lng)
        ]
    }).addTo(map);

    routingControl.on('routesfound', function (e) {
        let routes = e.routes[0];
        let coord = routes.coordinates;
        console.log(routes);
    });
};

// Reset functionality
btn.addEventListener("click", () => {
    if (startMarker) {
        map.removeLayer(startMarker);
        startMarker = null;
    }

    if (endMarker) {
        map.removeLayer(endMarker);
        endMarker = null;
    }

    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    if (currMarker) {
        map.removeLayer(currMarker);
        currMarker = null;
    }

    map.setView([17.3850, 78.4867], 6); // Reset to the original center and zoom level
});

Map();   
