
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
	energyUrl = `/kpi/${selectedBuilding}/${selectedMonth}`;
	powerUrl = `punta/${selectedBuilding}/${selectedMonth}`;
    
    // console.log(dataUrl);
	$.getJSON(energyUrl, function (data) {
		//console.log(data);
		d3.select("#kpi").text(Math.floor(data['energy(kWh)']));
        d3.select('#kpi2').text(`$ ${Math.floor(data['energy_cost'])}`);
	});
    
    $.getJSON(powerUrl, powerData =>{
        //Obtain the maximum power
        max_power = d3.max(powerData, d => d['power(kW)'])
        console.log(max_power);
        
        d3.select('#kpi3').text(Math.floor(max_power));
        d3.select('#kpi4').text(`$ ${Math.floor(max_power * 364.9)}`);
    });
    
}


//-------------------------------------------------------------------------------------------------
//Draw the graph
//-------------------------------------------------------------------------------------------------
function drawGraph() {
	url = `punta/${selectedBuilding}/${selectedMonth}`;
	//console.log(url);

	//Setup svg area
	var svgWidth = parseInt(d3.select('#grafica').style('width'));
	var svgHeight = 450;
    //var svgHeight = parseInt(d3.select('#grafica').style('height'));

	// Define the chart's margins as an object
	var margin = {
		top: 30,
		right: 30,
		bottom: 50,
		left: 50
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

    
    //-------------------------------------------------------
    //Read the endpoint and perform calculations
    //------------------------------------------------------
	d3.json(url).then(powerData =>{
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

        var xLabel = chartGroup.append('g')
            .attr('transform', `translate(${width/2}, ${height+35})`)
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('font-family', 'arial')
            .attr('font-size', 15)
            .text('Time stamp')
        
        var yLabel = chartGroup.append('g')
            .attr('transform', `translate(0, ${height/2})`)
            .append('text')
            .attr('x',0)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'arial')
            .attr('font-size', 15)
            .attr('transform', 'rotate(-90)')
            .text('Power (kW)')
        
        
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