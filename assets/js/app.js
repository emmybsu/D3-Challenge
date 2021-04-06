// // The code for the chart is wrapped inside a function
// // that automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width
    // and height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

//comment out to address window sizing

    // // @TODO: YOUR CODE HERE!
// var svgWidth = 960;
// var svgHeight = 500;

var margin = {
    top: 20,
    right: 40, 
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create an SVG wrapper, append an SVG group that will hold the chart, shift the latter by left and top margins
var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// import data
d3.csv('/assets/data/data.csv').then((demoData) => {
    //Step 1: Parse Data/ Cast as Numbers
    demoData.forEach((data) => {
        //data.abbr = data.abbr;
        data.age = +data.age;
        data.smokes = +data.smokes;
        console.log(data)
    
    //Step 2: Create scale functions
    // create x axis
    var xLinearScale = d3.scaleLinear()
    .domain([28, d3.max(demoData, d=> d.age)])
    .range([0, width]);

    // create y axis
    //@TODO - why is this not sequentially displayed?

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(demoData, d => d.smokes)])
    .range([height, 0]);
    

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    chartGroup.append('g')
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append('g')
    .call(leftAxis);

    // Step 5: Create Circles
    var circlesGroup = chartGroup.selectAll('scatter')
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d=> yLinearScale(d.smokes))
    .attr('r', '10')
    .attr('fill', 'royalblue')
    .attr('opacity', '.25');

    var circleLabels = chartGroup.selectAll(null)
    .data(demoData)
    .enter()
    .append('text');

    circleLabels
    .attr('x', (d) => {
        return xLinearScale(d.age);
    })
    .attr('y', (d) => {
        return yLinearScale(d.smokes);
    })
    .text((d)=>{
        return d.abbr;
    })
    .attr('font-family', 'sans-serif')
    .attr('font-size', '9px')
    .attr('text-anchor', 'middle')
    .attr('fill', 'white');

    
//======================================================================

    //tool tip update #2
// step 6.2 = append a div to the body to create tooltips, assign it a class
    // Step 6: Initialize tool tip
    // var toolTip = d3.select("scatter").append('div')
    // .attr('class', 'tooltip')
    // .offset([80, -60])
    // .html((d) =>{
    //     return(`${d.abbr}<hr><br>Median Age: ${d.age}<br>Smokes (Percentage): ${d.smokes}`);
    // });

    // //step 6.3 = add an mousever event to display a tooltip

    // // Step 7: Create tooltip in the chart
    // chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // mouseover event
    // circlesGroup.on('mouseover', (data) => {
    //     toolTip.show(data, this);
    // })

//======================================================================

    // Step 6: Initialize tool tip
    var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html((d) =>{
        return(`${d.abbr}<hr><br>Median Age: ${d.age}<br>Smokes (Percentage): ${d.smokes}`);    
    });

    // Step 7: Create tooltip in the chart
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // mouseover event
    circlesGroup.on('mouseover', function(d) {
        toolTip.style('display');
        toolTip.html(`${d.abbr}<hr><br>Median Age: ${d.age}<br>Smokes(%): ${d.smokes}`);
    
        toolTip.show(d, this);
    })
    // mouseout event
    .on('mouseout', (d, index) => {
        toolTip.hide(d);
    });

    // Create axes labels
    chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Smokers (%)")

    chartGroup.append("text")
    .attr("transform", `translate(${width /2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Age (Median)");
    
// }).catch((error) => {
//     console.log(error);
})
})};

//call responsiveChart when page loads
makeResponsive();

//call makeResponsive when page is resized
d3.select(window).on("resize", makeResponsive);