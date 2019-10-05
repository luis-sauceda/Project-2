// JavaScript source code

function setBuilding(building) {
	selectedBuilding = building;
	redraw();
}

function setMonth(month) {
	selectedMonth = month;
	redraw();
}

function redraw() {
	url = `punta/${selectedBuilding}/${selectedMonth}`;
	console.log(url);
	d3.json(url, function (data) {
		console.log(data);

		// Define SVG area dimensions
		var svgWidth = parseInt(d3.select('#grafica').style('width'));
		var svgHeight = parseInt(d3.select('#grafica').style('height'));

		// Define the chart's margins as an object
		var chartMargin = {
			top: 30,
			right: 30,
			bottom: 30,
			left: 30
		};

		// Define dimensions of the chart area
		var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
		var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

		var svg = d3.select("#grafica").append("svg").attr("height", svgHeight).attr("width", svgWidth);
		var chartGroup = svg.append("g")
			.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

		// Cast the relevant values to integers
		data.forEach(function (d) {
			d.power = parseFloat(d.power);
		});

		var z = data.map(function (d) { return d["measurement_time(UTC)"]; });
		console.log(z);

		// Set x, y and colors
		var xAxis = d3.scaleOrdinal()
			.domain(data.map(function (d) { return d["measurement_time(UTC)"]; }))
			.range([0, chartWidth]);

		svg.append("g")
			.attr("transform", `translate(0, ${chartHeight})`)
			.call(d3.axisBottom(xAxis));


		// Add Y axis
		var yAxis = d3.scaleLinear()
			.domain([0, d3.max(data, d => d["power(W)"]) + 1])
			.range([chartHeight, 0]);
		svg.append("g").call(d3.axisLeft(yAxis).ticks(5));


		svg.append("g").selectAll("rect").data(data)
			.enter()
			.append("rect")
			.attr("x", function (d) { return xAxis(d["measurement_time(UTC)"]); })
			.attr("y", function (d) { return 0; } )
			.attr("height", function (d) { return d["power(W)"]; })
			.attr("width", 20)
	});
}


// Cuerpo del js
if (location.pathname.includes("building2")) {
	setBuilding( insurgentes );
}
else {
	setBuilding( reforma );
}