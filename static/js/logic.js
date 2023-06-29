//store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Adding a Leaflet tile layer.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Creating a Leaflet map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streets]
});


//defining basemaps
let baseMaps = {
    "streets": streets
};

//defining the earthquake layergroup
let earthquake_data = new L.LayerGroup();

//defining the overlays and link the layergroups to separate overlays
let overlays = {
    "Earthquakes": earthquake_data,
};

//adding a control layer and pass in baseMaps and overlays
L.control.layers(baseMaps, overlays).addTo(myMap);

//this function will style all the earthquake areas on the map
function earthquakeStyle(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2])
    }
};

//defining a function to choose the fillColor of the earthquake based on the earthquake depth
function chooseColor(depth) {
    if (depth <= 10) return "yellow";
    else if (depth > 10 & depth <= 25) return "orange";
    else if (depth > 25 & depth <= 40) return "red";
    else if (depth > 40 & depth <= 55) return "purple";
    else if (depth > 55 & depth <= 70) return "blue";
    else return "black";
};

//defining a function to determine the radius of each earthquake marker
function chooseRadius(magnitude) {
    return magnitude*3;
};

//defining a d3 json request
d3.json(url).then(function (data) {
    L.geoJson(data, {
        pointToLayer: function (feature, lat_lon) {
            return L.circleMarker(lat_lon).bindPopup(feature.id);
        }, style: earthquakeStyle
    }).addTo(earthquake_data);
    earthquake_data.addTo(myMap);

});
//creating a legend 
let legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    let div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth Color Legend</h4>";
       div.innerHTML += '<i style="background: yellow"></i><span>(Depth < 10)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>(10 < Depth <= 25)</span><br>';
       div.innerHTML += '<i style="background: red"></i><span>(25 < Depth <= 40)</span><br>';
       div.innerHTML += '<i style="background: purple"></i><span>(40 < Depth <= 55)</span><br>';
       div.innerHTML += '<i style="background: blue"></i><span>(55 < Depth <= 70)</span><br>';
       div.innerHTML += '<i style="background: black"></i><span>(Depth > 70)</span><br>';
  
    return div;
  };
  //add the legend to the map
  legend.addTo(myMap);

//scratch work for collecting the necessary  and console logging
//collect data with d3
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let results = features.filter(id => id.id == "nc73872510"); //replace the id string with the argument of the function once created
    let first_result = results[0];
    console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]);
    console.log(coordinates[1]); 
    console.log(coordinates[2]); 
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    //define depth variable
    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);

});