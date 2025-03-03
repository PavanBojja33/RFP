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

const curr = document.querySelector('#curr');
curr.addEventListener('click',() => {
    map.locate({
        setView:true,
        maxZoom:10
    })  
    map.on('locationfound',function(e){
        var latlng = e.latlng;
        L.marker(latlng).addTo(map).bindPopup("You are here").openPopup();
    })
})

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
        ]
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

