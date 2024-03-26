

console.log("mapjs hit")

// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [28.2521, 83.9774],
    zoom: 8
});
// map tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {

    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> rabibasukala01 / rajprajapati02'
    , maxZoom: 19,

}).addTo(map);

// Get a reference to the locate control
var locateControl = L.control.locate().addTo(map);


// marker icons
function customIcon(name) {

    return `/static/assets/icons/${name}.svg`

}

var mypositionMarkerIcon = L.icon({
    iconUrl: mypositionIcon,
    // iconSize: [20, 50],

});

// custom popup content
function customPopup(feature, currentLocation) {
    const coords = feature.geometry.coordinates
    const place_name = feature.properties.place_name
    const mainImage = feature.properties.mainImage
    const slug = feature.properties.slug

    const distance = L.latLng(currentLocation).distanceTo(L.latLng(coords)) / 1000; // in km/ in km

    // console.log("co", coords)
    // console.log("cu", currentLocation)

    return `    <div class="pop">

    <img class="popimg" src="${mainImage}" alt="${mainImage}" srcset="">

    <div>

        <div class="nameAndView">
            <span class="popupname">${place_name}</span>

            <span class="view"> <img src="${paperplaneSvg}" alt="">${distance.toFixed(2)} km</span>
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
            navigator.geolocation.getCurrentPosition(
                // this to get coords for distance calculation
                function (myposition) {
                    const popupContent = customPopup(feature, [myposition.coords.longitude, myposition.coords.latitude]);
                    layer.bindPopup(popupContent, { offset: [0, -15] });
                },
                function (error) {
                    console.error("Error getting location:", error.message);
                }
            );
        },

        pointToLayer: function (feature, latlng) {

            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: customIcon(feature.properties.place_type),
                    iconSize: [38, 95],

                })
            });
            // return L.marker(latlng);
        }
    }
);

// clustering
const markers = L.markerClusterGroup().addLayer(geodata);
map.addLayer(markers);


function flyToPlace(e) {
    map.flyTo(e.latlng, 13); // Fly to the marker's location with zoom level 13
}


// TODO:
// this creates bugs in popup [IGNORE NOW]

// // // Function to fly to the marker's location when clicked
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
                // console.log("Latitude:", position.coords.latitude);
                // console.log("Longitude:", position.coords.longitude);
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


//------------------- live position of user --------------------------------:

// Create a marker for the current position
// var currentLocationMarker = L.marker([0, 0]).addTo(map);

// // Update the marker's position when the location changes
// function updateMarkerPosition(position) {
//     var latlng = [position.coords.latitude, position.coords.longitude];
//     console.log(latlng);
//     currentLocationMarker.setLatLng(latlng);
//     currentLocationMarker.setIcon(mypositionMarkerIcon);
// }

// // Error callback
// function errorCallback(error) {
//     console.error("Error getting location:", error.message);
// }

// // Get the current position and watch for changes
// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(updateMarkerPosition, errorCallback, {
//         enableHighAccuracy: true,
//         // maximumAge: 0
//     });
// } else {
//     console.error("Geolocation is not supported by this browser.");
// }

// --------------------------------------------------------------------------------------



// --------------------------------- routing:------------------------------------------
let routingControl = null; // Define a global variable to hold the routing control

function giveRoute(Placecoords) {
    // console.log("here   ", Placecoords);
    let lngPlace = Placecoords.split(',')[0];
    let latPlace = Placecoords.split(',')[1];

    // Trigger the locate method
    locateControl.start();


    // let user to turn on location
    turnLocation();

    navigator.geolocation.watchPosition(function (myposition) {
        console.log("located");
        // Remove existing routing control if it exists, looks realtime routing
        if (routingControl) {
            map.removeControl(routingControl);
        }

        let currentLocation = [myposition.coords.latitude, myposition.coords.longitude];

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(currentLocation[0], currentLocation[1]),
                L.latLng(latPlace, lngPlace)
            ],

            // here  customize the marker for  points 
            // marker creation of waypoints:
            createMarker: function () { return null; },

            showalternatives: false,
            draggableWaypoints: [true, false],  //to make the start point(current positin) draggable 
            addWaypoints: false,
            fitSelectedRoutes: false, // Disable automatic fitting of route bounds
            lineOptions: {
                styles: [{ color: 'purple', opacity: 1, weight: 5 }]
            },

            // for geocoding
            // geocoder: L.Control.Geocoder.nominatim()
        }).addTo(map);
    });

}
// -----------------------------------------------------------------------
// -----------------basic search yet one of hard lol------------------------------------------

// Get the district ,municipality and ward from the URL query parameters
function bottomsearch() {
    const params = new URLSearchParams(window.location.search);
    const district = params.get('district');
    const municipality = params.get('municipality');
    const ward = params.get('ward');

    const address = `${municipality}-${ward}, ${municipality}, ${district}, Nepal`; // Adjust the address format as needed
    // Use Nominatim geocoding to get the coordinates
    L.Control.Geocoder.nominatim().geocode(address, function (results) {
        if (results && results.length > 0) {
            console.log(results);
            const latlng = [results[0].center.lat, results[0].center.lng];
            // Zoom into the area
            map.setView(latlng, 13); // Adjust the zoom level as needed
        } else {
            console.error('Could not find coordinates for the address:', address);
        }
    });
}

// ----------------------------------------------

// -------------suggest location with nominatim geocoding in input field ----------------
// 
document.querySelector('#inputLocation').addEventListener('input', function () {
    var query = this.value;
    // console.log(query);
    if (query.length >= 3) { // Only search if at least 3 characters are entered
        L.Control.Geocoder.nominatim().geocode(query, function (results) {
            var suggestionsDiv = document.getElementById('suggestions');
            suggestionsDiv.innerHTML = '';
            results.forEach(function (result) {
                var suggestion = document.createElement('div');
                suggestion.textContent = result.name;
                suggestion.classList.add('suggestion');

                // if selected to that location
                suggestion.addEventListener('click', function () {
                    // console.log(result.center.lat);
                    L.marker(result.center).openOn(map); // Set map view to selected location

                    closeRoute();
                    /// get starting and end point [starting point is current location,end point is searched param]
                    giveRoute(`${result.center.lng},${result.center.lat}`);
                    map.flyTo(result.center, 18); // Fly to the marker's location with zoom level 18
                });

                suggestionsDiv.appendChild(suggestion);
            });
        });
    }
});


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
// var leafletTopRight = document.querySelector('.leaflet-top.leaflet-right');
// var routeicon = document.querySelector('#routeIcon');
// leafletTopRight.style.display = "none";
// routeicon.addEventListener('click', function () {
//     toggleIcon(leafletTopRight, [advanceMainSearchDiv, qrMainDiv]);
// });

// advance search
var advanceMainSearchDiv = document.querySelector('.advance-main-search-div');
var advanceSearchIcon = document.querySelector('#advanceSearchIcon');
advanceMainSearchDiv.style.display = "none";
advanceSearchIcon.addEventListener('click', function () {
    toggleIcon(advanceMainSearchDiv, [findRouteMainDiv, qrMainDiv]);
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
    toggleIcon(qrMainDiv, [findRouteMainDiv, advanceMainSearchDiv]);
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


// find route on search
var findRouteMainDiv = document.querySelector('.find-route-main-div');
var routeIcon = document.querySelector('#routeIcon');
findRouteMainDiv.style.display = "none";
routeIcon.addEventListener('click', function () {
    toggleIcon(findRouteMainDiv, [qrMainDiv, advanceMainSearchDiv]);
});
// close find route search
function closeRoute() {
    var findRouteMainDiv = document.querySelector('.find-route-main-div');

    if (findRouteMainDiv.style.display === 'none' || findRouteMainDiv.style.display === '') {
        findRouteMainDiv.style.display = 'block';
    } else {
        findRouteMainDiv.style.display = 'none';
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



// --------------------- scan qr code and decode----------------

let html5QrCode;

function qrscanner() {
    // This method will trigger user permissions
    Html5Qrcode.getCameras().then(devices => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
            try {
                var cameraId = devices[1].id;
            }
            catch {
                var cameraId = devices[0].id;
            }
            // .. use this to start scanning.
            html5QrCode = new Html5Qrcode(/* element id */ "reader",/* verbose= */ false);

            // start the scanning process.
            html5QrCode.start(
                cameraId,
                {
                    fps: 10,    // Optional, frame per seconds for qr code scanning
                    qrbox: { width: 150, height: 150 }  // Optional, if you want bounded box UI
                },
                (decodedText, decodedResult) => {
                    // do something when code is read
                    // console.log(`Code matched = ${decodedText}`);
                    console.log(decodedResult.decodedText);

                    // after found decoded text stop the camera
                    html5QrCode.stop().then((ignore) => {
                        // QR Code scanning is stopped.
                    }).catch((err) => {
                        // Stop failed, handle it.
                        console.log(err);
                    });
                },
                (errorMessage) => {
                    // parse error, ignore it.
                })
                .catch((err) => {
                    // Start failed, handle it.
                    console.log("camera failed", err);
                });
            // console.log(cameraId);
        }
    }).catch(err => {
        console.log(err)
    });


}
// function to stop the camera
function stopCamera() {
    // console.log("stop camera");
    if (html5QrCode) {
        closeQr();
        html5QrCode.stop().then((ignore) => {
            // QR Code scanning is stopped.
        }).catch((err) => {
            // Stop failed, handle it.
            console.log(err);
        });

    }
}
