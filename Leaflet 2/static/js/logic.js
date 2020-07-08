// Set variable for the data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// var faultLines = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundries.json";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  //response
  createFeatures(data.features);
});
// create a create features functions 
function createFeatures(earthquakeData) {

  // OnEachFeature with a pop up with information about the earthquake and location. 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h4>Location: " + feature.properties.place + 
    "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
    "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

// Create a function for circle radius based on the magnitude of the earthquake. 
  function circleRadius(magnitude){
      return magnitude * 20000; 
  }
// Create a function for circle color based on the magnitude of the earthquake. 
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

  // GeoJSON layer containing features for the earthquakeData. 
  // circle markers for the map.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (earthquakeData, latlng){
        return L.circle(latlng, {
            radius: circleRadius(earthquakeData.properties.mag),
            color: circleColor(earthquakeData.properties.mag),
            opacity: 1,
            fillOpacity: 0.7
        })
    },
    onEachFeature: onEachFeature
  });

  // Send the feature to the createMap layer. 
  createMap(earthquakes);
}

// Function for the createmap. 
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  });

// set variable for the fault layers 
  var faultLines = new L.LayerGroup();
  
  // BaseMaps object for base layers
  var baseMaps = {
    "Street Map": grayscaleMap,
    "Dark Map": darkmap, 
    "Satellite Map": satelliteMap
  };

  // overlay object for the  overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes, 
    FaultLines: faultLines
  };

  var faultlinesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

  d3.json(faultlinesUrl, function(data) {
    console.log(data);
    L.geoJSON(data, {
      style: function() {
        return {color: "orange", fillOpacity: 0}
      }
    }).addTo(faultLines)
    faultLines.addTo(myMap);
  });

  // Set My map variable to hold all the objects
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [grayscaleMap, earthquakes, faultLines]
  });
  
  // redefine the circle color function for the Legend. 
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

// Set object for the legend. 
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
    // Put legend in the map
    legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
};
