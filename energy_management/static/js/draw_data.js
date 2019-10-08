

//Select the desired month from the button selection
var selectedMonth = d3.select('input[name="optionsRadios"]:checked').node().value;


// Define the initial building
if (location.pathname.includes("building2")) {
	//setBuilding(insurgentes);
    var selectedBuilding = reforma;
}
else {
	//setBuilding(reforma);
    var selectedBuilding = insurgentes;
}



////////////////////////////      FUNCIONES      //////////////////////////////////////////////////////////

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
function drawKpi(selectedBuilding, selectedMonth) {
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
        //console.log(max_power);
        
        d3.select('#kpi3').text(Math.floor(max_power));
        d3.select('#kpi4').text(`$ ${Math.floor(max_power * 364.9)}`);
    });
    
}

drawKpi(selectedBuilding, selectedMonth);

//-------------------------------------------------------------------------------------------------
//Draw the graph
//-------------------------------------------------------------------------------------------------

//Setup svg area
var svgWidth = parseInt(d3.select('#grafica').style('width'));
var svgHeight = 600;
//var svgHeight = parseInt(d3.select('#grafica').style('height'));

// Define the chart's margins as an object
var margin = {
    top: 30,
    right: 30,
    bottom: 150,
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



function drawGraph(selectedBuilding, selectedMonth) {
	url = `punta/${selectedBuilding}/${selectedMonth}`;
	//console.log(url);

    //-------------------------------------------------------
    //Read the endpoint and perform calculations
    //------------------------------------------------------
	d3.json(url).then(powerData =>{
		// Cast the power measurement values to floats
		powerData.forEach(d => {
			d['power(kW)'] = parseFloat(d['power(kW)']);
		});
        //Update data after changes in the buttons
        //console.log(powerData);
        var x = xScale(powerData, width);
		var y = yScale(powerData, height);

		// Call x axis
		var xAxis = d3.axisBottom(x);
		
        var xAxis =chartGroup.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis)
            .selectAll('text')
                .attr('transform', 'rotate(-60)')
                .attr('text-anchor', 'end')
                .attr('font-size',12);


		//Call yAxis
		var yAxis = d3.axisLeft(y);

		var yAxis = chartGroup.append('g')
			.call(yAxis);

        var xLabel = chartGroup.append('g')
            .attr('transform', `translate(${width/2}, ${height + 125})`)
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
        
        //JOIN new data with old elements
		var rects = chartGroup.selectAll('rect')
			.data(powerData);
        
                // ENTER new elements present in new data.
		rects.enter()
			.append('rect')
			.attr('x', d => x(d['measurement_time(UTC)']))
			.attr('y', d => y(d['power(kW)']))
			.attr('width', x.bandwidth)
			.attr('height', d => height - y(d['power(kW)']))
			.attr('fill', 'gold')
        
        
        //update(powerData);
        
	});
};


function update(selectedBuilding, selectedMonth) {
	document.getElementById('grafica').innerHTML = "";

	url = `punta/${selectedBuilding}/${selectedMonth}`;
    //DELETE FROM HERE
    //Setup svg area
		var svgWidth = parseInt(d3.select('#grafica').style('width'));
		var svgHeight = 600;
		//var svgHeight = parseInt(d3.select('#grafica').style('height'));

		// Define the chart's margins as an object
		var margin = {
				top: 30,
				right: 30,
				bottom: 150,
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


    // TO HERE AND FIND THE WAY TO MAKE IT FULLY FYNAMIC SOMEDAY
    
    
    
    d3.json(url).then(powerData =>{
        var x = xScale(powerData, width);
		var y = yScale(powerData, height);
		// Call x axis
		var xAxis = d3.axisBottom(x);
		
        var xAxis =chartGroup.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(xAxis)
            .selectAll('text')
                .attr('transform', 'rotate(-60)')
                .attr('text-anchor', 'end')
                .attr('font-size',12);

		//Call yAxis
		var yAxis = d3.axisLeft(y);

		var yAxis = chartGroup.append('g')
			.call(yAxis);

        var xLabel = chartGroup.append('g')
            .attr('transform', `translate(${width/2}, ${height + 125})`)
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
        
		//JOIN new data with old elements
		var rects = chartGroup.selectAll('rect')
			.data(powerData);
        
        // EXIT old elements not present in new data
        rects.exit().remove()
    
        //UPDATE old elements present in new data.
        rects
			.attr('x', d => x(d['measurement_time(UTC)']))
			.attr('y', d => y(d['power(kW)']))
			.attr('width', x.bandwidth)
			.attr('height', d => height - y(d['power(kW)']))
        
        
        // ENTER new elements present in new data.
		rects.enter()
			.append('rect')
			.attr('x', d => x(d['measurement_time(UTC)']))
			.attr('y', d => y(d['power(kW)']))
			.attr('width', x.bandwidth)
			.attr('height', d => height - y(d['power(kW)']))
			.attr('fill', 'gold')
        
        
        
    })
};



//--------------------------------------------------------------------------------------------------------
//Draw the graph for the first time :v
//--------------------------------------------------------------------------------------------------------


// Draw the graph for the first time

drawGraph(selectedBuilding, selectedMonth);

//Listen to the changes on the selection buttons
d3.selectAll(('input[name="optionsRadios"]'))
    .on('change', function(){
        update(selectedBuilding, this.value);
        drawKpi(selectedBuilding, this.value);
    });

