
// Belly Button Biodiversity - Plotly.js
//samples.json> got data for names, metadata, samples
// BONUS: Build the Gauge Chart
 

// Use`d 3.json` to fetch the metadata for a sample
// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    var result= resultsarray[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  
  });
}

// Color palette for Gauge Chart
var arrColorsG = ["#A52A2A", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#7FFF00", "white"];

//=============Gauge Chart Function=======================//

function buildGaugeChart(sample) {
  console.log("sample", sample);

  d3.json("samples.json").then(data =>{

    var objs = data.metadata;
        var matchedSampleObj = objs.filter(sampleData => 
      sampleData["id"] === parseInt(sample));
    
    gaugeChart(matchedSampleObj[0]);
 });   
}

//======================================================//
//=============== GAUGE Chart ==================//
//======================================================//
function gaugeChart(data) {
  console.log("gaugeChart", data);

  if(data.wfreq === null){
    data.wfreq = 0;

  }

  let degree = parseInt(data.wfreq) * (180/10);

  // Trig to calc meter point
  let degrees = 180 - degree;
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);

  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  let path = mainPath.concat(pathX, space, pathY, pathEnd);
  
  let trace = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 50, color:'2F6497'},
      showlegend: false,
      name: 'WASHING FREQ',
      text: data.wfreq,
      hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size : 16,
      },
    marker: {colors:[...arrColorsG]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  let layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '#2F6497',
        line: {
          color: '#2F6497'
        }
      }],

    title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrubs Per Week</b> <br> <b> for each individual</b>',
    height: 650,
    width: 950,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});

}

function buildCharts(sample) {

// Use `d3.json` to fetch the sample data for the plots
d3.json("samples.json").then((data) => {
  var samples= data.samples;
  var resultsarray= samples.filter(sampleobject => 
      sampleobject.id == sample);
  var result= resultsarray[0]

  var ids = result.otu_ids;
  var labels = result.otu_labels;
  var values = result.sample_values;

//======================================================//
//================ BUBBLE Chart=================// 
//======================================================//

  var LayoutBubble = {
    margin: { t: 0 },
    title: "BUBBLE Chart",
    xaxis: { title: "OTU ID" },
    hovermode: "closest",
    };

    var DataBubble = [ 
    {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        }
    }
  ];

  Plotly.newPlot("bubble", DataBubble, LayoutBubble);

//=========================================================//
//===============  BAR Chart=======================//
//=========================================================// 
  var bar_data =[
    {
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];

  var barLayout = {
    title: "Top 10 OTUs found in each individual",
    margin: { t: 30, l: 150 }
  };

  Plotly.newPlot("bar", bar_data, barLayout);
});
}
 
function init() {

  // Dropdown select element
var selector = d3.select("#selDataset");

// Data selection from sample file given to populate the select options
d3.json("samples.json").then((data) => {
  var sampleNames = data.names;
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Default is the first sample from sample data
  const firstSample = sampleNames[0];
  buildMetadata(firstSample);
  buildCharts(firstSample);
  buildGaugeChart(firstSample)

});
}

// New data will bes elected each time when clicked on the JSON obeject
function optionChanged(newSample) {
buildMetadata(newSample);
buildCharts(newSample);
buildGaugeChart(newSample)

}

init();