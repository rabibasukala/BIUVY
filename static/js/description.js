var audioPlayer = document.getElementById('audioPlayer');
var audioSource = document.getElementById('audioSource');
var animalSelect = document.getElementById('animalSelect');

animalSelect.addEventListener('change', function () {
    var value = animalSelect.value;
    audioSource.src = `../media/sounds/${value}.wav`;
    audioPlayer.load(); // Reload the audio element to play the new sound
    //audioPlayer.play(); //autoplay when selected change
});