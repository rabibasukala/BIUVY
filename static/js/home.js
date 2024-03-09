

console.log("mapjs hit")

// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [28.2521, 83.9774],
    zoom: 8
});
// map tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {

    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> rabibasukala01'
    , maxZoom: 19,

}).addTo(map);

// marker icons
var customicon = L.icon({
    iconUrl: iconUrl,
    iconSize: [38, 95],

});

// custom popup content
function customPopup(feature) {
    return `    <div class="pop">

    <img class="popimg" src="../media/images/bkt.jpg" alt="" srcset="">

    <div>

        <div class="nameAndView">
            <span class="popupname">Bhaktapur</span>
            <span class="view">1156 views</span>
        </div>
        <div class="line"></div>

        <div class="popDesc">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro hic error voluptate ab possimus sint
                temporibus provident quod reiciendis, sequi minus nemo accusantium repellendus explicabo.
            </p>
        </div>

    </div>
</div>`
}

// retrive the geo data and plot it
const geodata = L.geoJSON(location_data
    , {
        onEachFeature: function (feature, layer) {

            const popupContent =
                // "<br>" +
                // feature.properties.Name +
                // "<br>" +
                // feature.properties.score +
                // "<br>" +
                // feature.properties.randomfeature +
                // "<br>" +


                customPopup(feature);


            layer.bindPopup(popupContent);

        },
        pointToLayer: function (feature, latlng) {
            // console.log(feature)
            return L.marker(latlng, { icon: customicon });
        }
    }
);

// clustering
const markers = L.markerClusterGroup({ spiderfyOnMaxZoom: true }).addLayer(geodata);
map.addLayer(markers);


// // routing:
// var routing = L.Routing.control({
//     waypoints: [
//         L.latLng(27.711773, 85.541609),
//         L.latLng(27.625952, 85.634814)
//     ],
//     showalternatives: false,
//     draggableWaypoints: false,
//     addWaypoints: false,
//     lineOptions: {
//         styles: [{ color: 'blue', opacity: 1, weight: 5 }]
//     },
//     geocoder: L.Control.Geocoder.nominatim()

// }).addTo(map);
// toggle function
function toggleIcon(elementToShow, elementsToHide) {
    elementsToHide.forEach(element => {
        if (element.style.display !== "none" && element !== elementToShow) {
            element.style.display = "none";
        }
    });

    if (elementToShow.style.display === "none") {
        elementToShow.style.display = "block";
    } else {
        elementToShow.style.display = "none";
    }
}

// routing icon:
var leafletTopRight = document.querySelector('.leaflet-top.leaflet-right');
var routeicon = document.querySelector('#routeIcon');
leafletTopRight.style.display = "none";
routeicon.addEventListener('click', function () {
    toggleIcon(leafletTopRight, [advanceMainSearchDiv, qrMainDiv]);
});

// advance search
var advanceMainSearchDiv = document.querySelector('.advance-main-search-div');
var advanceSearchIcon = document.querySelector('#advanceSearchIcon');
advanceMainSearchDiv.style.display = "none";
advanceSearchIcon.addEventListener('click', function () {
    toggleIcon(advanceMainSearchDiv, [leafletTopRight, qrMainDiv]);
});

// qr
var qrMainDiv = document.querySelector('.qr-main-div');
var qrIcon = document.querySelector('#qrIcon');
qrMainDiv.style.display = "none";
qrIcon.addEventListener('click', function () {
    toggleIcon(qrMainDiv, [leafletTopRight, advanceMainSearchDiv]);
});


// Function to scroll images left or right
function scrollImages(direction) {
    const container = document.querySelector('.feature-lists-overlay');
    if (direction === 'left') {
        container.scrollLeft -= 200; // Adjust scroll amount as needed
    } else {
        container.scrollLeft += 200; // Adjust scroll amount as needed
    }
}
