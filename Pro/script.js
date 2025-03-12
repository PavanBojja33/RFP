let map;
let startMarker = null;
let endMarker = null;
let currMarker = null;
let routingControl;

// Initialize map
function Map() {
    map = L.map('map').setView([17.3850, 78.4867], 6);

    // Tile Layer - OpenStreetMap
    const osmTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Adding search bar for start and end locations
    const { GeoSearchControl, OpenStreetMapProvider } = window.GeoSearch;
    const provider = new OpenStreetMapProvider();

    // Search control for start location
    const searchControlStart = new GeoSearchControl({
        provider: provider,
        style: 'bar',
        autoClose: true,
        searchLabel: 'Search for a start location...',
    });

    // Search control for end location
    const searchControlEnd = new GeoSearchControl({
        provider: provider,
        style: 'bar',
        autoClose: true,
        searchLabel: 'Search for an end location...',
    });

    map.addControl(searchControlStart);
    map.addControl(searchControlEnd);

    // Handle result of searching for start location
    map.on('geosearch/showlocation', function (e) {
        let result = e.location;
        if (result) {
            placeMarker(result.latlng, 'start');
        }
    });

    // Handle result of searching for end location
    map.on('geosearch/showlocation', function (e) {
        let result = e.location;
        if (result) {
            placeMarker(result.latlng, 'end');
        }
    });

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

    // Adding "Calculate Shortest Path" button on the map
    const calculateRouteButton = L.control({ position: 'topright' });
    calculateRouteButton.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'calculateRouteBtn');
        div.innerHTML = '<button>Calculate Shortest Path</button>';
        div.querySelector('button').onclick = calculateRoute;
        return div;
    };
    calculateRouteButton.addTo(map);

    // Adding "Reset Map" button on the map
    const resetButton = L.control({ position: 'bottomright' });
    resetButton.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'resetBtn');
        div.innerHTML = '<button>Reset Map</button>';
        div.querySelector('button').onclick = resetMap;
        return div;
    };
    resetButton.addTo(map);
}

// Function to place a marker for the searched location (start or end)
function placeMarker(latlng, locationType) {
    if (locationType === 'start') {
        if (!startMarker) {
            startMarker = L.marker(latlng).addTo(map);
            startMarker.bindPopup("Start Location").openPopup();
        } else {
            alert('Start location already selected.');
        }
    } else if (locationType === 'end') {
        if (!endMarker) {
            endMarker = L.marker(latlng).addTo(map);
            endMarker.bindPopup("End Location").openPopup();
        } else {
            alert('End location already selected.');
        }
    }
}

// Function to calculate and display the shortest route between start and end locations
function calculateRoute() {
    if (!startMarker || !endMarker) {
        alert("Please select both start and end locations first.");
        return;
    }

    let start = startMarker.getLatLng();
    let end = endMarker.getLatLng();

    // If routing control exists, remove the previous route
    if (routingControl) {
        map.removeControl(routingControl);
    }

    // Create a new route using Leaflet Routing Machine
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(start.lat, start.lng),
            L.latLng(end.lat, end.lng)
        ],
        routeWhileDragging: true, // Allow route to update while dragging markers
        createMarker: function() { return null; } // Prevent creating additional markers on the route
    }).addTo(map);

    routingControl.on('routesfound', function (e) {
        let routes = e.routes[0];
        let coord = routes.coordinates;
        console.log("Route Coordinates:", coord); // Optionally log route coordinates
    });
}

// Reset functionality (clear markers, route, etc.)
function resetMap() {
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
}

// Initialize the map
Map();
