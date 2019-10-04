// JavaScript source code

function setBuilding(building) {
	selectedBuilding = building;
	redraw();
}

function setMonth(month) {
	selectedMonth = month;
	redraw();
}

if (location.pathname.includes("building2")) {
	setBuilding( "building2" );
}
else {
	setBuilding( "building1" );
}

function redraw() {

}