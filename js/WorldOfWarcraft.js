const video = document.getElementById("videoWow");

video.addEventListener("loadedmetadata", function() {
    video.currentTime = 10;
});