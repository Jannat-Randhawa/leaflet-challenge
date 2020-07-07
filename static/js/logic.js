// variable to store GeoJSON data for the earthquake URL 
var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Fetch data for the earthquake data 
d3.json(earthquakeData, function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData){

    function onEachFeature(feature, layer){
        layer.bindPopup("<h3> Location" + feature.properties.place +
      "</h3><hr><p> Time of Occurance" + new Date(feature.properties.time) + 
      "</p><hr><p> Magnitude Size: " + feature.properties.mag + "</p>");
    }

    // Set marker size and color magnitude according to the magnitude. 
    function markerSize(magnitude) {
        return magnitude * 10000;
    }

    function circleColor(magnitude){
        switch (true){
        case magnitude > 5: 
            return "#ff0000"; 
        case magnitude > 4:
            return "#ff8000";
        case magnitude > 3:
            return "ffff00";
        case magnitude > 2: 
            return "#bfff00";
        case magnitude > 1:
            return "#00ff80";
        default: 
            return "#DAF7A6";
        }
    };

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(earthquakeData, latlng){
            return L.circle(latlng, {
                radius: markerSize(earthquakeData.properties.mag), 
                color: circleColor(earthquakeData.properties.mag)
            });
        },
        onEachFeature: onEachFeature
    });
    
    createMap(earthquakes);
}

function createMap(earthquakes){

// set tile layer for the map 
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Create map 
  var myMap = L.map("map", {
      center: [37.0902, 95.7129],
      zoom: 4, 
      layer: [streetMap]
  });

  earthquakes.addto(myMap);
}
