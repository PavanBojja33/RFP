var map;
var startMarker=null;
var endMarker=null;

function Map(){

    map = L.map('map').setView([17.3850, 78.4867], 6);
    
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    map.on("click",function(e){
        mark(e.latlng);
    });
    
    map.on('locationfound' , function(e){
        L.marker(e.latlng).addTo(map).bindPopup("Current Location").openPopup();
    });

    map.on('locationerror' , function(e){
        alert('Unable to fetch location');
    });
    
    // getCurLoc();
}

function mark(ee){
    if(!startMarker){
        startMarker=L.marker(ee).addTo(map);
        startMarker.bindPopup("Start Location").openPopup();
    }
    else if(!endMarker){
        endMarker=L.marker(ee).addTo(map);
        endMarker.bindPopup("End Location").openPopup();
        getRoute();
    }
}

function getCurLoc(){
    map.locate({setView : true , maxZoom:10}); 
}

function getRoute(){
    L.Routing.control({
        waypoints: [
            L.latLng(startMarker.getLatLng().lat , startMarker.getLatLng().lng),
            L.latLng(endMarker.getLatLng().lat , endMarker.getLatLng().lng)
        ]
    }).on('routesfound',function(e){
        e.routes[0].coordinates.forEach(function(coord,index){
            setTimeout(()=>{
                marker.setLatLng([coord.lat,coord.lng])
            },100*index);
        })
    })
    
    .addTo(map);
}

Map();  

