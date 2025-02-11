var map;
var startMarker=null;
var endMarker=null;
const btn = document.querySelector("#btn");

function Map(){

    map = L.map('map').setView([17.3850, 78.4867], 6);
    
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    map.on("click",function(e){
        mark(e.latlng);
    });
}

const mark = (ee)=>{
    if(!startMarker){
        startMarker=L.marker(ee).addTo(map);
        startMarker.bindPopup("Start Location").openPopup();
    }
    else if(!endMarker){
        endMarker=L.marker(ee).addTo(map);
        endMarker.bindPopup("End Location").openPopup();
        getRoute();
    }
};

function getCurLoc(){
    map.locate({setView : true , maxZoom:10}); 

}
let routingControl;

function getRoute() {
    let start =startMarker.getLatLng();
    let end = endMarker.getLatLng();
    if(routingControl){
        map.removeControl(routingControl);  
    }

    routingControl = L.Routing.control({
        waypoints :[
            L.latLng(start.lat,start.lng),
            L.latLng(end.lat,end.lng)
        ],
        lineOptions: {
            styles: [
                {
                    color: 'blue',            // Set the route line color
                    weight: 5,                // Set the route line thickness
                    opacity: 0.7,             // Set the route line opacity
                    dashArray: '5, 10',       // Set dashed line pattern
                    lineJoin: 'round'         // Smooth corners of the route line
                }
            ]
        }
    }).addTo(map);

    routingControl.on('routesfound',function(e){
        let routes = e.routes[0];
        let coord = routes.coordinates;

        console.log(routes);
    });
};

btn.addEventListener("click",() =>{
    if(startMarker){
        map.removeLayer(startMarker);
        startMarker=null;
    }

    if(endMarker){
        map.removeLayer(endMarker);
        endMarker=null;
    }

    if(routingControl){
        map.removeControl(routingControl);
        routingControl=null;
    }
    map.setView([17.3850, 78.4867], 6);
});

Map();  

