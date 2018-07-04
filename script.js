/** SETUP
 * select the element in which to plot the data visualization
 * include a title through a header element 
 * include a legend through a div element
 * include the frame of an SVG canvas, in which to draw the data as it is queried
 * define the scales for the horizontal and vertical axes
 * define the range for both axes. These rely on the width and height values of the SVG and can be set prior to retrieving the data
 */

// SELECT 
const container = d3.select(".container");


// TITLE 
container
    .append("h1")
    .attr("id", "title")
    .text("Alpe D'Huez 🚵");


// LEGEND
// for the legend include a div and then, as siblings, a header and an unordered list
const legend = container
                .append("div")
                .attr("id", "legend");

legend
    .append("h2")
    .text("Cycling Record");

// in the unordered list include, as siblings, two list items describing the different types of data point displayed in the scatter plot
const ul = legend
            .append("ul");
ul
    .append("li")
    .text("doping allegations");
ul
    .append("li")
    .text("no doping allegations");


// FRAME
// define a measure for the margin, included to frame the contents of the SVG inside of the SVG canvas itself by an arbitrary amount
// this to avoid any cropping, especially for the axes
const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  // include a larger margin to the left as to show the values of minutes and seconds on the vertical axis
  left: 50
}

// define width and height measure deducting the arbitrary values by the respective margins
// this allows to later reference the width and height values and have them refer to the area inside of the SVG canvas, where the elements are not cropped out
const width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// include an SVG with a viewbox attribute dictating the width to height ratio
// the width property is included in the stylesheet and the height is included by proxy through the ratio defined by the viewbox
const containerCanvas = container
                          .append("svg")
                          // by adding the respective margins, the SVG canvas assumes the dimensions defined by the arbitrary values (800, 400)
                          // anything using the width and height values will be drawn inside of the canvas (but needs to be first positioned inside of the frame by a measure equal to the margins. This is achieved with a group element) 
                          .attr("viewBox", `0 0 ${width + margin.left + margin.right}  ${height + margin.top + margin.bottom}`);

// include a group element in which to position the SVG elements 
// by translating the group element by the measure defined by the margin, it is possible to have the SVG elements positioned inside the frame 
const canvasContents = containerCanvas
                          .append("g")
                          .attr("transform", `translate(${margin.left}, ${margin.top})`);


// SCALES
// for the horizontal scale include a time scale
// for the range (where the data will be displayed as output), include values from 0 up to the width
const xScale = d3
                .scaleTime()
                .range([0, width]);

// for the vartical scale include another time scale
// since the data points are set to be drawn with the smallest values on top, the range is not reversed
// the smallest values will be therefore at the top and the biggest values at the bottom (as the SVG coordinate system works top down) 
const yScale = d3
                .scaleTime()
                .range([0, height]);

// define parse functions to properly format the data passed in the array 
const parseTimeRecord = d3
                    .timeParse("%M:%S");

const parseTimeYear = d3
                    .timeParse("%Y");


/** DATA
 * create an instance of an XMLHttpRequest object, to retrieve the data at the provided URL
 * upon receiving the data, set the domain of the scales and create the connected axes
 * plot the chart by including circle elements in the SVG
 * include a tooltip through a div (the tooltip should appear and disappear on the basis of the mouseenter and mouseout events, on the circle elements)
 */

// XMLHTTPREQUEST
const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const request = new XMLHttpRequest();
request.open("GET", URL, true);
request.send();
// on load call a function to draw the scatter plot 
// pass as argument the array containing the (35) objects
request.onload = function() {
    let json = JSON.parse(request.responseText);
    drawScatterPlot(json);
}

function drawScatterPlot(data) {
  /**
     * data is an array containing 35 objects
     * each data[i] object has several fields, used to describe the time, year, rider and other information pertinent for the scatter plot
     * fields such as
     **** Time, describing the record time in minutes and seconds
     **** Year, the four digit year 
     **** Name, the rider 
     **** Doping, doping allegations
     */

  // FORMAT DATA
  // format the data to have the proper structure, for both time scales
  data.forEach((d) => {
    d["Time"] = parseTimeRecord(d["Time"]);
    d["Year"] = parseTimeYear(d["Year"]);
  });


  // DOMAIN
  // the scales' domains are defined by the minimum and maximum values of the year and record time
  xScale
      // d3.extent returns the minimum and maximum values
      .domain(d3.extent(data, d => d["Year"]));
      
      yScale
      .domain(d3.extent(data, d => d["Time"]));
     

  // AXES 
  // initialize the axes based on the scales
  const xAxis = d3
                  .axisBottom(xScale);
  const yAxis = d3
                  .axisLeft(yScale)
                  // alter the format of the tick labels for the record time, as to display the date object in the minutes:seconds format (such as 37:10)
                  .tickFormat(d3.timeFormat("%M:%S"));

  // include the axes within group elements
  canvasContents
      .append("g")
      .attr("id", "x-axis")
      // for the horizontal axis, position it at the bottom of the area defined by the SVG canvas
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

  canvasContents
      .append("g")
      .attr("id", "y-axis")
      .call(yAxis);


  // TOOLTIP
  // include a tooltip through a div element
  const tooltip = container
                      .append("div")
                      .attr("id", "tooltip");

  // PLOT CHART
  // include as many circle elements as required by the data array (35 data points)
  canvasContents
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      // include two listeners for the mouseenter and mouseout events
      // as the cursor hovers on the element, transition the tooltip into view, with the text describing the circle element
      // as the cursor leaves, transition the tooltip out of sight
      // important: the event listener accepts as argument the data being processed (d), which is then used in the text of the tooltip
      .on("mouseenter", (d) => {
          tooltip 
              // alter the opacity to make the tooltip visible
              .style("opacity", 1)
              // position the tooltip close to the cursor, using the d3.event object
              // console.log() this event to establish which properties are needed
              .style("left", `${d3.event.layerX - 70}px`)
              .style("top", `${d3.event.layerY - 10}px`)
              // include a data-date property which describes the year of the connected circle element
              .attr("data-year", d["Year"])
              .text(() => {
                  // d["Year"], as it is processed through the parse function, represents an instance of the date object
                  // getFullYear() allows to retrieve the four-digit year 
                  let year = d["Year"].getFullYear();
                  // d["Time"] is as well an instance of a date object
                  // getMinutes() and getSeconds() allow to retrieve the pertinent information
                  let record = d["Time"].getMinutes() + ":" + d["Time"].getSeconds();
                  let rider = d["Name"];
                //   display in the tooltip the year, followed by the record and name of the rider
                  return `${year} ${record} ${rider}`;
              });
      })
      .on("mouseout", () => {
          tooltip
              .style("opacity", 0);
      })
    //   include data attributes as specified in the user stories
      .attr("data-xvalue", (d) => d["Year"])
      .attr("data-yvalue", (d) => d["Time"])
      // position the circle elements
      // the horizontal position is determined by the year (which describes the x-axis)
      .attr("cx", (d) => xScale(d["Year"]))
      // the vertical position is determined by the record time (which describes the y-axis)
      .attr("cy", (d) => yScale(d["Time"]))
      // give the same radius for all circle elements
      .attr("r", 5)
      // give a fill color depeending on whether or not doping allegations are connected to the record
      // if no doping allegation is present, the doping field of the object is an empty string
      .attr("fill", (d) => (d["Doping"] == "") ? "#163D90" : "#E94180" ) 
      .attr("class", "dot");
}