const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
    let metadataField = data.metadata;
    // console.log("This is the metadata", metadata);

    // Filter the metadata for the object with the desired sample number
    let sampleNumber = metadataField.filter(subject => subject.id == sample)[0];
    console.log("The selected metadata sample", sampleNumber);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sampleNumber).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let samplesField = data.samples;
    // console.log("This is the samples field", samplesField);

    // Filter the samples for the object with the desired sample number
    let sampleNumber = samplesField.filter(subject => subject.id == sample)[0];
    console.log("The selected samples sample", sampleNumber);

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sampleNumber.otu_ids;
    let otuLabels = sampleNumber.otu_labels;
    let sampleValues = sampleNumber.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Jet'
      }
    }];

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart
    // Sort the the sample values high to low
    let sortedValues = sampleValues.slice().sort((a, b) => b - a);
    // console.log(sortedValues);
    
    // Slice the top 10 sample values
    let slicedSortedValues = sortedValues.slice(0,10);
    // console.log(slicedSortedValues);

    // Reverse for plotting 
    slicedSortedValues.reverse();

    // Map the top ten values and labels from the sorted and sliced array
    let topTenValues = slicedSortedValues.map(value => value);
    let topTenLabels = slicedSortedValues.map((value, index) => otuLabels[index]);
    // Map the top ten otu_ids to a list of strings for your yticks
    let topTenOtuIds = slicedSortedValues.map((value, index) => `OTU ${otuIds[index]}`);

    console.log(topTenValues);
    console.log(topTenLabels);
    console.log(topTenOtuIds);
    
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
      type: 'bar',
      x: topTenValues,
      y: topTenOtuIds,
      text: topTenLabels,
      orientation: 'h' 
    }];

    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {

    // Get the names field
    let namesField = data.names;
    console.log("The names field", namesField);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    for (let i = 0; i < namesField.length; i++) {
      dropdownMenu.append("option")
                  .text(namesField[i])
                  .property("value", namesField[i]);
    }

    // Get the first sample from the list
    let firstSample = namesField[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
