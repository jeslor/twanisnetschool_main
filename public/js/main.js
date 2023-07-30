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
                items:2
            },
            600:{
                items:4
            },
            1000:{
                items:6
            }
        }
    });

    $(".flash-alerts").fadeTo(2000, 500).slideUp(500, function(){
        $(".flash-alerts").slideUp(500);
    });
});

const openDeleteModalButtons = document.querySelectorAll('.openDeleteModal');
const deleteModal = document.getElementById('deleteVideoOverlay');
const deleteVideoModal = document.querySelector('.deleteVideoModal');
const closeDeleteModalButton = document.getElementById('closeDeleteModal');

openDeleteModalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        deleteModal.classList.add('show');
        const url  = e.target.attributes['deleteUrl'].value;
        const form = deleteVideoModal.getElementsByTagName('form')[0];
        const videoName = e.target.attributes['videoName'].value;
        form.action = url;
        deleteVideoModal.querySelector('#videoName').innerHTML = videoName;     
    });
});


if (deleteVideoModal) {
    deleteVideoModal.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
        deleteModal.classList.remove('show');
    });
}

if (closeDeleteModalButton) {
    closeDeleteModalButton.addEventListener('click', (e) => {
        deleteModal.classList.remove('show');
    });
}










