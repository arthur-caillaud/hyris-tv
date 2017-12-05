//Double-click and on video to fullscreen and press spacebar to pause

$(document).ready(function($) {
    let video = document.getElementById('video_played_html5_api');
    let isfullscreenVideo = false;
    $(document).on("keydown", e => {
        if((e || window.event).keyCode === 32){
            if(!$('input').is(':focus') || !$('textarea').is(':focus')){
                e.preventDefault();
                video.paused ? video.play() : video.pause();
            }
        }
    });
    $(video).dblclick(() => {
        if(video.requestFullscreen){
            if(!isfullscreenVideo){
                video.requestFullscreen();
                isfullscreenVideo = true;
                video.play();
            }
            else{
                video.exitFullscreen();
                isfullscreenVideo = false;
            }
        }else if(video.mozRequestFullScreen){
            if(!isfullscreenVideo) {
                video.mozRequestFullScreen();
                isfullscreenVideo = true;
                video.play();
            }
            else{
                video.mozCancelFullscreen();
                isfullscreenVideo = false;
            }
        }else if(video.webkitRequestFullscreen){
            if(!isfullscreenVideo) {
                video.webkitRequestFullscreen();
                isfullscreenVideo = true;
                video.play();
            }
            else{
                video.webkitExitFullscreen();
                isfullscreenVideo = false;
            }
        }
    })
});
