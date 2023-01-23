console.log("HEY")
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    console.log(sample)

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var sample_results = samples.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var meta_results = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var result = sample_results[0];
    console.log(result)
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    meta_sample = meta_results[0]
    console.log("meta Sample")
    console.log(meta_sample)
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids
    console.log("otu_id")
    console.log(otu_ids)
    var otu_labels = result.otu_labels
    console.log("otu_label")
    console.log(otu_labels)
    var sample_values = result.sample_values
    console.log("sample_values")
    console.log(sample_values)
    
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    washFreq = parseFloat(meta_sample.wfreq)
    console.log("wash freq")
    console.log(washFreq)

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    
    var yticks = otu_ids.slice(0, 10).map(OTUID => `OTU ${OTUID}`).reverse();
    console.log("yticks")
    console.log(yticks)

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var trace1 = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      name: "Bar Chart",
      type: "bar",
      orientation: "h"
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace1, layout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var traceBubble = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth',
      }
      
    }];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubblelayout = {
      title: "Bacteria Cultures Per Sample",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      hovermode: "closest",
      xaxis: {title:"OTU ID"}
    };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", traceBubble, bubblelayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeTrace = [
      {
        value: washFreq,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "Belly Button Washing Frequency<br></br>Scrubs Per Week"},
        gauge: {
          axis: {range: [0,10], dtick: "2"},
          bar: {color: "black"},
          steps:[
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lime"},
            {range: [8, 10], color: "green"}
          ],
        }
      }];
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeTrace, gaugeLayout);
  });
}
