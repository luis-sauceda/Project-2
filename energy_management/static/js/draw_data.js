
// Cuerpo del js
if (location.pathname.includes("building2")) {
	setBuilding(insurgentes);
}
else {
	setBuilding(reforma);
}



////////////////////////////      FUNCIONES      //////////////////////////////////////////////////////////

// Function used to set the selected building and redraw everything that needs to be redrawn
function setBuilding(building) {
	selectedBuilding = building;
	drawGraph();
	drawKpi();
}

// Function used to set the selected month and redraw everything that needs to be redrawn
function setMonth(month) {
	selectedMonth = month;
	drawGraph();
	drawKpi();
}


// Function used for updating x-scale var upon click on axis label :v
function xScale(chartData, width){
    //Create my xScale
    var xScale = d3.scaleBand()
        .domain(chartData.map(d => d['measurement_time(UTC)']))
            .range([0, width])
            .paddingInner(0.1)
            .paddingOuter(0.1);
    return xScale
};


//Function used for updating y-scale var upon click on axis label :v
function yScale(chartData, height){
    var min = 0;
    var max =  d3.max(chartData, d=> d['power(kW)']);
    
    // Define range
    var yScale = d3.scaleLinear()
        .domain([min, max])
        .range([height, 0]);
    return yScale
};


// Function to set the Kpi's in the html
function drawKpi() {
	dataUrl = `/kpi/${selectedBuilding}/${selectedMonth}`;
	console.log(dataUrl);
	$.getJSON(dataUrl, function (data) {
		console.log(data);
		d3.select("#kpi").text(data.kpiTotal);
	});
}


//-------------------------------------------------------------------------------------------------
//Draw the graph
//-------------------------------------------------------------------------------------------------
function drawGraph() {
	url = `punta/${selectedBuilding}/${selectedMonth}`;
	console.log(url);

	//Setup svg area
	var svgWidth = parseInt(d3.select('#grafica').style('width'));
	var svgHeight = parseInt(d3.select('#grafica').style('height'));

	// Define the chart's margins as an object
	var margin = {
		top: 30,
		right: 30,
		bottom: 30,
		left: 30
	};

	// Define dimensions of the chart area
	var width = svgWidth - margin['left'] - margin['right'];
	var height = svgHeight - margin.top - margin.bottom;

	// Create an SVG wrapper :v
	var svg = d3.select("#grafica")
		.append("svg")
		.attr("height", svgHeight)
		.attr("width", svgWidth)

	var chartGroup = svg.append("g")
		.attr("transform", `translate(${margin['left']}, ${margin['top']})`);

	d3.json(url, function(powerData) {
		// Cast the power measurement values to floats
		powerData.forEach(d => {
			d['power(kW)'] = parseFloat(d['power(kW)']);
		});

		//--------------------------------------------------------------------------
		//Define initial stuff for my graph :v
		//-------------------------------------------------------------------------
		//Create an xScale and yScale
		var x = xScale(powerData, width);
		var y = yScale(powerData, height);

		// Call x axis
		var xAxis = d3.axisBottom(x);

		var xAxis = chartGroup.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis);


		//Call yAxis
		var yAxis = d3.axisLeft(y);

		var yAxis = chartGroup.append('g')
			.call(yAxis);

		//Draw rectangles
		var rects = chartGroup.selectAll('rect')
			.data(powerData);

		rects.enter()
			.append('rect')
			.attr('x', d => x(d['measurement_time(UTC)']))
			.attr('y', d => y(d['power(kW)']))
			.attr('width', x.bandwidth)
			.attr('height', d => height - y(d['power(kW)']))
			.attr('fill', 'gold')
	});

}