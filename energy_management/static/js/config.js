// API key
const API_KEY = "pk.eyJ1IjoibHVpc2F1Y2VkYSIsImEiOiJjazByZGgwOGcwMzhjM2xsNjZ1MjBkbWFhIn0.fWK1mTXREsro3wuz3hRu2A";

var selectedBuilding = null;
var selectedMonth = null;

function setBuilding(building){
	selectedBuilding = building;
	redraw();
}

function setMonth(month) {
	selectedMonth = month;
	redraw();
}

function redraw() {
	console.log(selectedBuilding);
	console.log(selectedMonth);
}