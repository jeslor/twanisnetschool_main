$( document ).ready(function() {
    $('.subject_slider').owlCarousel({
        autoplay: true,
        slideTransition: 'linear',
        autoplayTimeout: 6000,
        autoplaySpeed: 6000,
        loop:true,
        margin:10,
        nav:false,
        dots:false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:4
            },
            1000:{
                items:6
            }
        }
    });
});

