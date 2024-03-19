console.log('description.js loaded');


// video / image /audio switch
document.querySelector('.audio').addEventListener('click', function () {
    document.querySelector('.audio-container').style.display = 'block';
    document.querySelector('.topvideo').style.display = 'none';
    document.querySelector('.carousel').style.display = 'none';
    // Pause the video when switching to audio
    document.querySelector('.topvideo').pause();
    // resume the audio when switching
    // document.querySelector('#audioPlayer').play();


});
document.querySelector('.video').addEventListener('click', function () {
    document.querySelector('.topvideo').style.display = 'block';
    document.querySelector('.audio-container').style.display = 'none';
    document.querySelector('.carousel').style.display = 'none';
    // resume the video when switching 
    document.querySelector('.topvideo').play();
    // Pause the audio when switching to other
    document.querySelector('#audioPlayer').pause();

});
document.querySelector('.gallary').addEventListener('click', function () {
    document.querySelector('.carousel').style.display = 'block';
    document.querySelector('.audio-container').style.display = 'none';
    document.querySelector('.topvideo').style.display = 'none';
    // Pause the video/audio when switching to gallay
    document.querySelector('.topvideo').pause();
    document.querySelector('#audioPlayer').pause();


});


// scroll left and right
document.getElementById('scroll-left').addEventListener('click', function () {
    document.querySelector('.bottom-container').scrollBy({
        left: -355 - 24,
        behavior: 'smooth'
    });
});

document.getElementById('scroll-right').addEventListener('click', function () {
    document.querySelector('.bottom-container').scrollBy({
        left: 355 + 24,
        behavior: 'smooth'
    });
});

// Auto scroll right every 2 seconds
let scrollInterval = setInterval(() => {
    let container = document.querySelector('.bottom-container');
    container.scrollBy({
        left: 355 + 24,
        behavior: 'smooth'
    });
}, 2000);





// map

var map = L.map('map', {
    center: coords,
    zoom: 14
});
// map tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,

}).addTo(map);
L.marker(coords).addTo(map)