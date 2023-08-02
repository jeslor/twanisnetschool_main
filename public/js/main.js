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



const InPutParent = document.getElementById('the-basics');
const searchSuggestions = document.querySelector('.search_suggestions')

// Solution 1
// ===============================
// function autocomplete(inp) {
//     var currentFocus;
//     inp.addEventListener("input",  async function(e) {
//         let suggestions = ['english', 'history', 'chemistry']
//         if (e.target.value !== '') {
//             const data = await fetch('/searchInput', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ searchSuggestion: e.target.value }),
//             })
     
//              const  moreSuggestions = await data.json()
//                 suggestions = [...suggestions, ...moreSuggestions]
//         }
//         var a, b, i, val = this.value;
//         closeAllLists();
//         if (!val) { return false;}
//         currentFocus = -1;
//         a = document.createElement("DIV");
//         a.setAttribute("id", this.id + "autocomplete-list");
//         a.setAttribute("class", "autocomplete-items");
//         this.parentNode.appendChild(a);
//         for (i = 0; i < suggestions.length; i++) {
//           if (suggestions[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//             b = document.createElement("DIV");
//             b.innerHTML = "<strong>" + suggestions[i].substr(0, val.length) + "</strong>";
//             b.innerHTML += suggestions[i].substr(val.length);
//             b.innerHTML += "<input type='hidden' value='" + suggestions[i] + "'>";
//                 b.addEventListener("click", function(e) {
//                 inp.value = this.getElementsByTagName("input")[0].value;
//                 closeAllLists();
//             });
//             a.appendChild(b);
//           }
//         }
//     });
//     inp.addEventListener("keydown", function(e) {
//         var x = document.getElementById(this.id + "autocomplete-list");
//         if (x) x = x.getElementsByTagName("div");
//         if (e.keyCode == 40) {
//           currentFocus++;
//           addActive(x);
//         } else if (e.keyCode == 38) { //up
//           currentFocus--;
//           addActive(x);
//         } else if (e.keyCode == 13) {
//           e.preventDefault();
//           if (currentFocus > -1) {
//             if (x) x[currentFocus].click();
//           }
//         }
//     });
//     function addActive(x) {
//       if (!x) return false;
//       removeActive(x);
//       if (currentFocus >= x.length) currentFocus = 0;
//       if (currentFocus < 0) currentFocus = (x.length - 1);
//       x[currentFocus].classList.add("autocomplete-active");
//     }
//     function removeActive(x) {
//       for (var i = 0; i < x.length; i++) {
//         x[i].classList.remove("autocomplete-active");
//       }
//     }
//     function closeAllLists(elmnt) {
//       var x = document.getElementsByClassName("autocomplete-items");
//       for (var i = 0; i < x.length; i++) {
//         if (elmnt != x[i] && elmnt != inp) {
//         x[i].parentNode.removeChild(x[i]);
//       }
//     }
//   }
//   document.addEventListener("click", function (e) {
//       closeAllLists(e.target);
//   });
//   }
// autocomplete(SearchInput)

// Solution 2
// ===============================


let suggestions = []
var substringMatcher = function(strs) {

    return function findMatches(q, cb) {
       let searchInput  =  InPutParent.getElementsByClassName('tt-input');
       searchInput[0].addEventListener('input', async (e) => {
                if (e.target.value !== '') {
                    const data = await fetch('/searchInput', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ searchSuggestion: e.target.value }),
                    })
            
                    const  moreSuggestions = await data.json()
                        suggestions = [...suggestions, ...moreSuggestions]
                }
            })
         
      var matches, substringRegex;
  
      // an array that will be populated with substring matches
      matches = [];
  
      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
  
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
  
      cb(matches);
    };
  };
  
  
  var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
    'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];
  
  $('#the-basics .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'states',
    source: substringMatcher(suggestions)
  });














