//***************************************************************************************
// CDMX Map with 2 markers to locate the buildings of the project
//***************************************************************************************
// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
  center: [19.383720, -99.214921],
  zoom: 13
});

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
var markerReforma = L.marker([19.3735716, -99.2612436], {
  draggable: false,
  title: "Reforma 490"
}).addTo(myMap);

// Binding a pop-up to our marker
markerReforma.bindPopup("Reforma 490");

var markerInsurgentes = L.marker([19.3941062, -99.1723895], {
  draggable: false,
  title: "Insurgentes 688 Rules"
}).addTo(myMap);

markerReforma.bindPopup("Insurgentes 688");
//***************************************************************************************
//***************************************************************************************