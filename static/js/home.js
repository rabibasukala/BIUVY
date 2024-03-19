

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
function customIcon(name) {
    return `/static/assets/icons/${name}.svg`

}

var mypositionMarkerIcon = L.icon({
    iconUrl: mypositionIcon,
    // iconSize: [20, 50],

});

// custom popup content
function customPopup(feature) {
    coords = feature.geometry.coordinates
    place_name = feature.properties.place_name
    mainImage = feature.properties.mainImage
    slug = feature.properties.slug



    return `    <div class="pop">

    <img class="popimg" src="${mainImage}" alt="${mainImage}" srcset="">

    <div>

        <div class="nameAndView">
            <span class="popupname">${place_name}</span>

            <span class="view"> <img src="${paperplaneSvg}" alt="">10.2 km</span>
        </div>
        <div class="line"></div>

        <div class="popbtns">
        <!-- <button class="popbtn"><img src="${detailSvg}" alt="">Details</button>
           <button  class="popbtn"><img src="${directionSvg}" alt="">Directions</button> --> 
            <button  onclick="window.location.href='/description/${slug}'" class="popbtn">Details</button>
            <button onclick="giveRoute('${coords}')" class="popbtn">Directions</button>

        </div>

    </div>
</div>`
}



// retrive the geo data and plot it
const geodata = L.geoJSON(geolocation_desc
    , {
        onEachFeature: function (feature, layer) {

            const popupContent =
                customPopup(feature);


            layer.bindPopup(popupContent, { offset: [0, -15] });

        },
        pointToLayer: function (feature, latlng) {
            // console.log(feature)
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: customIcon(feature.properties.place_type),
                    iconSize: [38, 95],

                })
            });
            return L.marker(latlng);
        }
    }
);

// clustering
const markers = L.markerClusterGroup().addLayer(geodata);
map.addLayer(markers);

// TODO:
// this creates bugs in popup [IGNORE NOW]

// // Function to fly to the marker's location when clicked
// function flyToMarker(e) {
//     map.flyTo(e.latlng, 19); // Fly to the marker's location with zoom level 19
// }

// Add a click event listener to the marker
// markers.on('click', flyToMarker);


//---------------------------- make user to turn the location on:----------
function turnLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            function (position) {
                console.log("Latitude:", position.coords.latitude);
                console.log("Longitude:", position.coords.longitude);
                // Add your logic for handling the location here
            },
            // Error callback
            function (error) {
                console.error("Error getting location:", error.message);
                // Handle the error or prompt the user to enable location services
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        // Handle the case where geolocation is not supported
    }
}

// ------------------------------------------------

// --------------------------------- routing:------------------------------------------
let routingControl = null; // Define a global variable to hold the routing control

function giveRoute(Placecoords) {
    let lngPlace = Placecoords.split(',')[0];
    let latPlace = Placecoords.split(',')[1];

    // Remove existing routing control if it exists
    if (routingControl) {
        map.removeControl(routingControl);
    }

    // let user to turn on location
    turnLocation();

    navigator.geolocation.getCurrentPosition(function (myposition) {

        let currentLocation = [myposition.coords.latitude, myposition.coords.longitude];

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(currentLocation[0], currentLocation[1]),
                L.latLng(latPlace, lngPlace)
            ],

            // marker creation of waypoints:
            // here  customize the marker for start and end points only
            createMarker: function (i, waypoint, n) {
                // Use custom icons for start and end points
                if (i === 0) {
                    map.flyTo(waypoint.latLng, 19);
                    return L.marker(waypoint.latLng);
                } else if (i === n - 1) {
                    return L.marker(waypoint.latLng);
                } else {
                    // Default marker for intermediate points
                    return L.marker(waypoint.latLng);
                }
            },
            showalternatives: false,
            draggableWaypoints: [true, false],  //to make the start point(current positin) draggable 
            // addWaypoints: false,

            lineOptions: {
                styles: [{ color: 'purple', opacity: 1, weight: 5 }]
            },

            // for geocoding
            geocoder: L.Control.Geocoder.nominatim()
        }).addTo(map);
    });
}
// -----------------------------------------------------------------------




//------------------- live position of user --------------------------------:

// Create a marker for the current position
var currentLocationMarker = L.marker([0, 0]).addTo(map);

// Update the marker's position when the location changes
function updateMarkerPosition(position) {
    var latlng = [position.coords.latitude, position.coords.longitude];
    console.log(latlng);
    currentLocationMarker.setLatLng(latlng);
    currentLocationMarker.setIcon(mypositionMarkerIcon);
}

// Error callback
function errorCallback(error) {
    console.error("Error getting location:", error.message);
}

// Get the current position and watch for changes
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateMarkerPosition, errorCallback, {
        enableHighAccuracy: true,
        // maximumAge: 0
    });
} else {
    console.error("Geolocation is not supported by this browser.");
}

// --------------------------------------------------------------------------------------


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

// close advance search
function toggleAdvanceSearch() {
    var searchDiv = document.querySelector('.advance-main-search-div');
    if (searchDiv.style.display === 'none' || searchDiv.style.display === '') {
        searchDiv.style.display = 'block';
    } else {
        searchDiv.style.display = 'none';
    }
}

// qr
var qrMainDiv = document.querySelector('.qr-main-div');
var qrIcon = document.querySelector('#qrIcon');
qrMainDiv.style.display = "none";
qrIcon.addEventListener('click', function () {
    toggleIcon(qrMainDiv, [leafletTopRight, advanceMainSearchDiv]);
});
// close qr
function closeQr() {
    var searchDiv = document.querySelector('.qr-main-div');
    if (searchDiv.style.display === 'none' || searchDiv.style.display === '') {
        searchDiv.style.display = 'block';
    } else {
        searchDiv.style.display = 'none';
    }
}


// Function to scroll images left or right
function scrollImages(direction) {
    const container = document.querySelector('.feature-lists-overlay');
    if (direction === 'left') {
        container.scrollBy({
            left: -107 - 22.4, // Adjust scroll amount as needed
            behavior: 'smooth'
        });
    } else {
        container.scrollBy({
            left: 107 + 22.4, // Adjust scroll amount as needed
            behavior: 'smooth'
        });
    }
}



//
// var geoURL = 'http://127.0.0.1:8000/get_all_place_info'
// var location_data = {};
// fetch(geoURL)
//     .then(response => response.json())
//     .then(data => {
//         // Process the JSON data here
//         const location_data = data;
//         console.log(location_data);
//     })
//     .catch(error => {
//         // Handle any errors here
//         console.error('Error:', error);
//     });




// console.log(geolocation_desc)