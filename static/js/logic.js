var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h4>Location: " + feature.properties.place + 
    "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
    "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  function circleRadius(magnitude){
      return magnitude * 10000; 
  }

  function circleColor(magnitude){
    switch (true) {
        case magnitude > 5:
            return "#800026";
        case magnitude > 4:
            return "#BD0026";
        case magnitude > 3:
            return "#E31A1C";
        case magnitude > 2:
            return "#FC4E2A";
        case magnitude > 1:
            return "#FD8D3C";
        default:
            return "#FFEDA0";
        }
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (earthquakeData, latlng){
        return L.circle(latlng, {
            radius: circleRadius(earthquakeData.properties.mag),
            color: circleColor(earthquakeData.properties.mag),
            opacity: 1,
            fillOpacity: 1
        })
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": grayscaleMap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [grayscaleMap, earthquakes]
  });

  function circleColor(magnitude){
    switch (true) {
        case magnitude > 5:
            return '#800026';
        case magnitude > 4:
            return '#BD0026';
        case magnitude > 3:
            return "#E31A1C";
        case magnitude > 2:
            return '#FC4E2A';
        case magnitude > 1:
            return '#FD8D3C';
        default:
            return "#FFEDA0";
        }
  }
var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        magLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"

        for (var i = 0; i < magLevels.length; i++) {
            div.innerHTML +=
                '<i class="rect" style="background: ' + circleColor( magLevels[i] + 1) + '"></i> ' +
                magLevels[i] + ( magLevels[i + 1] ? '&ndash;' +  magLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
