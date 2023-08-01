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



const SearchInput = document.getElementById('searchInput');
const searchSuggestions = document.querySelector('.search_suggestions')


if (SearchInput) {
    SearchInput.addEventListener('keyup', async (e) => {
      let match = e.target.value.match(/^[a-zA-Z ]*/)
      let match2 = e.target.value.match(/\s*/)
      if (match2[0] === e.target.value) {
        searchSuggestions.style.display = 'none'
        searchSuggestions.innerHTML = ''
      }
      if (e.target.value !== '' && match[0] === e.target.value) {
        const data = await fetch('/searchInput', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchSuggestion: e.target.value }),
        })
 
        const suggestions = await data.json()
        searchSuggestions.innerHTML = ''
        if (suggestions.length) {
          suggestions.forEach((element) => {
            searchSuggestions.style.display = 'block'
            searchSuggestions.innerHTML += `<button onClick="openSugestion()" type="submit" form="main_search_homeform" class="search_select_li">${element} </button>`
            return
          })
        } else {
          searchSuggestions.style.display = 'none'
        }
      }
    })
  }

  const eachSuggestions  = document.querySelectorAll('.eachSuggestion');
  if (eachSuggestions.length) {
    console.log(eachSuggestions);
  }


  const openSugestion = (e) => {
    alert('hello');
  }










