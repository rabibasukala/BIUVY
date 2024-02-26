

console.log("mapjs hit")

// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [28.2521, 83.9774],
    zoom: 8
});
// map tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



// retrive the geo data and plot it
const geodata = L.geoJSON(location_data
    , {
        onEachFeature: function (feature, layer) {

            const popupContent =
                "<br>" +
                feature.properties.Name +
                "<br>" +
                feature.properties.score +
                "<br>" +
                feature.properties.randomfeature +
                "<br>";


            layer.bindPopup(popupContent);

        },
        pointToLayer: function (feature, latlng) {
            // console.log(feature)
            return L.marker(latlng);
        }
    }
);

// clustering
const markers = L.markerClusterGroup({ spiderfyOnMaxZoom: true }).addLayer(geodata);
map.addLayer(markers);


