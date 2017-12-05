// Owl Carousel Implementation for videoSlider.ejs

let owl = $('.owl-carousel');

owl.owlCarousel({
    loop:true,
    margin:10,
    stagePadding:50,
    autoWidth: true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:5
        }
    },
    autoplay:true,
    autoplayTimeout:4000,
    autoplayHoverPause:false
});

$('.play').on('click',function(){
    owl.trigger('play.owl.autoplay',[1000])
});

$('.stop').on('click',function(){
    owl.trigger('stop.owl.autoplay')
});

// Fading out Flash messages

$(document).ready(function($) {
    let flashMessage = $(".flasMessageWrapper")
    if (flashMessage){
        flashMessage.delay( 3000 ).fadeOut( 400 );
    }
});

// Infinite scroll for Direct root

$(document).ready(function($) {
    $('.ajaxDirectContainer').infiniteScroll({
        // options
        path: '/direct/page/{{#}}',
        status: '.scroller-status',
        append: '.directRow',
        history: false,
        hideNav: '.pagination'
    });
});

// Load only if exist
function load_img(obj_ref,src,src_backup){
  console.log(obj_ref.src,src)
  if(obj_ref.src != src){
    var image = new Image();
    image.onload = function () {
       obj_ref.src=src;
    }
    image.src = src;
  }
}
