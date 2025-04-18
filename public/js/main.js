const navHumbutton = document.getElementById('navHumbutton');
const navMenu = document.getElementById('navMenu');





var x, i, j, l, ll, selElmnt, a, b, c;
x = document.getElementsByClassName("mySelect");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);
if (navHumbutton) {
    navHumbutton.addEventListener('click', (e) => {
       if (navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
       }else{
        navMenu.classList.add('show');
       }
    });
  
}



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

    $('.owl-sampleVideos').owlCarousel({
      loop:true,
      margin:10,
      responsiveClass:true,
      responsive:{
          0:{
              items:1,
              nav:true
          },
          600:{
              items:2,
              nav:true
          },
          900:{
              items:3,
              nav:true
          },
          1000:{
              items:4,
              nav:true,
              loop:false
          }
      }
  })

    $(".flash-alerts").fadeTo(2000, 500).slideUp(500, function(){
        $(".flash-alerts").slideUp(500);
    });




    $('.neo-video-player').each(function () {
      // Video
      var $video_container = $(this)
      var $video = $(this).find('#video-element')
    
      // set download link
      $('#download-video').attr('href', $('#video-element source').attr('src'))
    
      // Video Controls
      var $video_controls = $(this).find('.video-control-part')
      var $progress_bar = $(this).find('.bar-progress')
      var $progress = $(this).find('.bar-time')
    
      var $buffer_bar = $(this).find('.bar-buffer')
      var $play_button = $(this).find('.play-btn')
      var $sound_button = $(this).find('.sound-btn')
    
      var $volume_wrapper = $(this).find('.volume')
      var $volume_bar = $(this).find('.bar-volume')
    
      var $full_screen_btn = $(this).find('.fullscreen-btn')
      var $current = $(this).find('.current')
      var $duration = $(this).find('.duration')
      var $fast_fwd = $(this).find('.fastFwd')
    
      // Toggles play/pause for the video
      function playVideo() {
        if ($video[0].paused) {
          $video[0].play()
          $video_controls.addClass('playing')
          $play_button.addClass('pause')
    
          if ($video_container.parents('.video-header').length) {
            $video_container.parents('.video-header').addClass('playing')
          }
        } else {
          $video[0].pause()
          $video_controls.removeClass('playing')
          $play_button.removeClass('pause')
          $video_container.parents('.video-header').removeClass('playing')
        }
      }
    
      function updateVolume(x, vol) {
        if (vol) {
          $percentage = vol * 100
        } else {
          $position = x - $volume_wrapper.offset().left
          $percentage = (100 * $position) / $volume_wrapper.width()
        }
    
        if ($percentage > 100) {
          $percentage = 100
        }
        if ($percentage < 0) {
          $percentage = 0
        }
    
        //update volume bar and video volume
        $volume_bar.css('width', $percentage + '%')
        $video[0].volume = $percentage / 100
    
        if ($video[0].volume == 0) {
          $sound_button.addClass('mute')
        } else if ($video[0].volume > 0.5) {
          $sound_button.removeClass('mute').removeClass('low')
        } else {
          $sound_button.removeClass('mute').addClass('low')
        }
      }
    
      function changeSpeed() {
        if ($video[0].playbackRate === 1) {
          $video[0].playbackRate = 1.25
          $fast_fwd.val('Speed : 1.25x')
        } else if ($video[0].playbackRate === 1.25) {
          $video[0].playbackRate = 1.5
          $fast_fwd.val('Speed : 1.5x')
        } else if ($video[0].playbackRate === 1.5) {
          $video[0].playbackRate = 1.75
          $fast_fwd.val('Speed : 1.75x')
        } else if ($video[0].playbackRate === 1.75) {
          $video[0].playbackRate = 2
          $fast_fwd.val('Speed : 2x')
        } else if ($video[0].playbackRate === 2) {
          $video[0].playbackRate = 1
          $fast_fwd.val('Speed : 1x')
        }
      }
    
      function launchFullscreen() {
        if ($video[0].requestFullscreen) {
          $video[0].requestFullscreen()
        } else if ($video[0].mozRequestFullScreen) {
          $video[0].mozRequestFullScreen()
        } else if ($video[0].webkitRequestFullscreen) {
          $video[0].webkitRequestFullscreen()
        } else if ($video[0].msRequestFullscreen) {
          $video[0].msRequestFullscreen()
        }
      }
    
      function time_format(seconds) {
        var m =
          Math.floor(seconds / 60) < 10
            ? '0' + Math.floor(seconds / 60)
            : Math.floor(seconds / 60)
        var s =
          Math.floor(seconds - m * 60) < 10
            ? '0' + Math.floor(seconds - m * 60)
            : Math.floor(seconds - m * 60)
        return m + ':' + s
      }
    
      function startBuffer() {
        $current_buffer = $video[0].buffered.end(0)
        $max_duration = $video[0].duration
        $perc = (100 * $current_buffer) / $max_duration
        $buffer_bar.css('width', $perc + '%')
    
        if ($current_buffer < $max_duration) {
          setTimeout(startBuffer, 500)
        }
      }
    
      function updatebar(x) {
        $position = x - $progress.offset().left
        $percentage = (100 * $position) / $progress_bar.width()
        if ($percentage > 100) {
          $percentage = 100
        }
        if ($percentage < 0) {
          $percentage = 0
        }
        $progress.css('width', $percentage + '%')
        $video[0].currentTime = ($video[0].duration * $percentage) / 100
      }
    
      $video.on('loadedmetadata', function () {
        $current.text(time_format(0))
        $duration.text(time_format($video[0].duration))
        updateVolume(0, 0.7)
        setTimeout(startBuffer, 150)
      })
    
      // Play/pause on video click
      $video.click(function () {
        playVideo()
      })
    
      // Video duration timer
      $video.on('timeupdate', function () {
        $current.text(time_format($video[0].currentTime))
        $duration.text(time_format($video[0].duration))
        var currentPos = $video[0].currentTime
        var maxduration = $video[0].duration
        var perc = (100 * $video[0].currentTime) / $video[0].duration
        $progress.css('width', perc + '%')
      })
    
      /* VIDEO CONTROLS
                  ------------------------------------------------------- */
    
      // Hide button controls when video is playing
      $video_container.on('mouseleave', function () {
        if ($video[0].paused === false) {
          $video_container.addClass('playing')
        }
      })
    
      // Show button controls on hover
      $video_container.on('mouseover', function () {})
    
      // Play/pause on button click
      $play_button.click(function () {
        playVideo()
      })
    
      // Fast Forward Button
      $fast_fwd.click(function () {
        changeSpeed()
      })
    
      // Volume Drag
      var volumeDrag = false
      $volume_wrapper.on('mousedown', function (e) {
        volumeDrag = true
        $video[0].muted = false
        $sound_button.removeClass('mute')
        updateVolume(e.pageX)
      })
    
      $(document).on('mouseup', function (e) {
        if (volumeDrag) {
          volumeDrag = false
          updateVolume(e.pageX)
        }
      })
    
      $(document).on('mousemove', function (e) {
        if (volumeDrag) {
          updateVolume(e.pageX)
        }
      })
    
      // Mute video on button click
      $sound_button.click(function () {
        $video[0].muted = !$video[0].muted
        $(this).toggleClass('mute')
        if ($video[0].muted) {
          $volume_bar.css('width', 0)
        } else {
          $volume_bar.css('width', $video[0].volume * 100 + '%')
        }
      })
    
      // Full Screen Button
      $full_screen_btn.click(function () {
        launchFullscreen()
      })
    
      // VIDEO PROGRESS BAR
      //when video timebar clicked
      var timeDrag = false /* check for drag event */
      $progress_bar.on('mousedown', function (e) {
        timeDrag = true
        updatebar(e.pageX)
      })
      $(document).on('mouseup', function (e) {
        if (timeDrag) {
          timeDrag = false
          updatebar(e.pageX)
        }
      })
      $(document).on('mousemove', function (e) {
        if (timeDrag) {
          updatebar(e.pageX)
        }
      })
    })
});

const openDeleteModalButtons = document.querySelectorAll('.openDeleteModal');
const deleteModal = document.getElementById('deleteVideoOverlay');
const deleteVideoModal = document.querySelector('.deleteVideoModal');
const closeDeleteModalButton = document.getElementById('closeDeleteModal');
const mainBodyHolder = document.querySelector('.main-body-holder');


if (openDeleteModalButtons) {
  openDeleteModalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        deleteModal.classList.add('show');
        mainBodyHolder.classList.add('heightControlled');
        const url  = e.target.attributes['deleteUrl'].value;
        const form = deleteVideoModal.getElementsByTagName('form')[0];
        const videoName = e.target.attributes['videoName'].value;
        const metaTag = e.target.attributes['metaName'].value;
        form.action = url;
        deleteVideoModal.querySelector('#videoName').innerHTML = videoName;   
        deleteVideoModal.querySelector('#metaTag').innerHTML = metaTag;  
    });
});
}
  



if (deleteVideoModal) {
    deleteVideoModal.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
        deleteModal.classList.remove('show');
        mainBodyHolder.classList.remove('heightControlled');
    });
}

if (closeDeleteModalButton) {
    closeDeleteModalButton.addEventListener('click', (e) => {
        deleteModal.classList.remove('show');
        mainBodyHolder.classList.remove('heightControlled');
    });
}



const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.querySelector('.search_suggestions')

// Solution 1
// ===============================
function autocomplete(inp) {
    var currentFocus;
    inp.addEventListener("input",  async function(e) {
        let suggestions = [ ]
        let word = e.target.value
        if (word !== '') {
            const data = await fetch('/searchInput', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ searchSuggestion: word }),
            })
     
             let  moreSuggestions = await data.json()
          
                suggestions = [...suggestions, ...moreSuggestions]

        }
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < suggestions.length; i++) {
          if (suggestions[i].toLowerCase().includes(val.toLowerCase()) || suggestions[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + suggestions[i].substr(0, val.length) + "</strong>";
            b.innerHTML += suggestions[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + suggestions[i] + "'>";
                b.addEventListener("click", function(e) {
                  inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
                document.getElementById('searchForm').submit();
            });
            a.appendChild(b);
          }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) { //up
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }
  if (searchInput) { 
    autocomplete(searchInput)
  }





  const userEmail = document.getElementById('userEmail');
  const emailGuide = document.querySelector('.emailGuide');
  const closeEmailGuide = document.getElementById('closeEmailGuide');
  const registerForm = document.getElementById('registerForm');
  if (userEmail) {
    userEmail.addEventListener('click', (e) => {
        e.stopPropagation();
        emailGuide.classList.add('show');
    })
  }

  if(closeEmailGuide){
    closeEmailGuide.addEventListener('click', (e) => {
        emailGuide.classList.remove('show');
        userEmail.focus();
    })
  }

  if(registerForm){
    registerForm.addEventListener('click', (e) => {
        emailGuide.classList.remove('show');
    })
  }


  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebar');
  const openSidebar = document.getElementById('openSidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  if (openSidebar) {
      openSidebar.addEventListener('click', (e) => {
        if (sidebar.classList.contains('show')) {
          sidebar.classList.remove('show');
          sidebarOverlay.classList.remove('show');
          mainBodyHolder.classList.remove('heightControlled');
          openSidebar.style.display = 'flex';
        }else{
          sidebar.classList.add('show');
          sidebarOverlay.classList.add('show');
          mainBodyHolder.classList.add('heightControlled');
          openSidebar.style.display = 'none';
          window.scrollTo(0, 0);
        }
      })
    }
    
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', (e) => {
        sidebar.classList.remove('show');
        mainBodyHolder.classList.remove('heightControlled');
        sidebarOverlay.classList.remove('show');
        openSidebar.style.display = 'flex';
      })
    }
    
    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        e.stopPropagation();
      })
    }
    if (closeSidebar) {
      closeSidebar.addEventListener('click', (e) => {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
        mainBodyHolder.classList.remove('heightControlled');
        openSidebar.style.display = 'flex';
      })
  }


  









  
  
  




















