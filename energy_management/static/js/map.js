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

//Get the URL to put the href in the pop-up marker
var url1 = window.location.href;

// define popup marker content
var popupContentRef1 =  '<a target="_blank" class="popup" href="/" target = "_top">' +
                    '<img src="static/images/46321.png" height="200" width="250"/>' +
                    "<div>Reforma 490 - Sub2</div>" +
                    '</a>';
// Binding a pop-up to our marker
markerReforma1.bindPopup(popupContentRef1,{minWidth: 300});

// Pass in some initial options, and then add it to the map using the addTo method
var markerReforma2 = L.marker([19.3719720, -99.2607440], {
  draggable: false,
  title: "Reforma 490 - Sub3"
}).addTo(myMap);

var popupContentRef2 =  '<a target="_blank" class="popup" href="/" target = "_top">' +
                    '<img src="static/images/46321.png" height="200" width="250"/>' +
                    "<div>Reforma 490 - Sub3</div>" +
                    '</a>';
                    
// Binding a pop-up to our marker
markerReforma2.bindPopup(popupContentRef2,{minWidth: 300});

var markerInsurgentes = L.marker([19.3941062, -99.1723895], {
  draggable: false,
  title: "Insurgentes 688"
}).addTo(myMap);

var url2 = window.location.href + 'building2';

// var popupContentIns =  '<a target="_blank" class="popup" href="' + url2 + '" target = "_self">' +
//                     '<img src="energy_management/documentation/Insurgentes 688.png" height="200" width="250"/>' +
//                     "<div>Insurgentes 688</div>" +
//                     '</a>';

var popupContentIns =  '<a target="_blank" class="popup" href="/building2" target = "_top">' +
                    '<img src="static/images/46191.PNG" height="200" width="250"/>' +
                    "<div>Insurgentes 688</div>" +
                    '</a>';

markerInsurgentes.bindPopup(popupContentIns,{minWidth: 300});

  //***************************************************************************************
//***************************************************************************************