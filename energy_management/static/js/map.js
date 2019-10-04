//***************************************************************************************
// CDMX Map with 3 markers to locate the buildings of the project
//***************************************************************************************
// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
  center: [19.383720, -99.214921],
  zoom: 13
});


setTimeout(function(){ myMap.invalidateSize()}, 500);


// Add a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);


// Create a new marker
// Pass in some initial options, and then add it to the map using the addTo method
var markerReforma1 = L.marker([19.3735716, -99.2612436], {
  draggable: false,
  title: "Reforma 490 - Sub2"
}).addTo(myMap);

// Binding a pop-up to our marker
markerReforma1.bindPopup("Reforma 490 - Sub2");

// Pass in some initial options, and then add it to the map using the addTo method
var markerReforma2 = L.marker([19.3719720, -99.2607440], {
  draggable: false,
  title: "Reforma 490 - Sub3"
}).addTo(myMap);

// Binding a pop-up to our marker
markerReforma2.bindPopup("Reforma 490 - Sub3");

var markerInsurgentes = L.marker([19.3941062, -99.1723895], {
  draggable: false,
  title: "Insurgentes 688"
}).addTo(myMap);


// var popupContentIns =  '<a target="_blank" class="popup" href="http://www.gicsa.com.mx/es/portafolio/detalle-proyecto/insurgentes-688">' +
//                     '<img src="energy_management/documentation/Insurgentes 688.png" height="200" width="250"/>' +
//                     "<div>Insurgentes 688</div>" +
//                     '</a>';
var url = window.location.href + 'test';

var popupContentIns =  '<a target="_blank" class="popup" href="' + url + '">' +
                    '<img src="energy_management/documentation/Insurgentes 688.png" height="200" width="250"/>' +
                    "<div>Insurgentes 688</div>" +
                    '</a>';

markerInsurgentes.bindPopup(popupContentIns,{minWidth: 300});

console.log(url);

  //***************************************************************************************
//***************************************************************************************