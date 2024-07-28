
const videoContainer = document.getElementById('allVideoContent');
const loader  = document.getElementById('loader');
const noMoreVideos = document.getElementById('noMoreVideos');
const allVideoBody = document.getElementById('allVideo_content_body');
const categoryCheckbox = document.querySelectorAll('.categoryCheckbox');
const subjectCheckbox = document.querySelectorAll('.subjectCheckbox');
const levelCheckbox = document.querySelectorAll('.levelCheckbox');




const limit = 25;
let skip = localStorage.getItem('allVideos')===null ? 0: JSON.parse(localStorage.getItem('allVideos')).length ;
let moreVideos = localStorage.getItem('allVideos')===null ? []: JSON.parse(localStorage.getItem('allVideos'));
let filteredVideos = localStorage.getItem('filteredVideos')===null ? []: JSON.parse(localStorage.getItem('filteredVideos'));

const categoryFilters = localStorage.getItem('categoryFilters')===null ? {
  free: false,
  paid: false,
  all: true
}: JSON.parse(localStorage.getItem('categoryFilters'));

const subjectFilters = localStorage.getItem('subjectFilters')===null ? {
  all: true,
  mathematics: false,
  english: false,
  physics: false,
  chemistry: false,
  biology: false,
  history: false,
}: JSON.parse(localStorage.getItem('subjectFilters'));

let stillMoreVideos = localStorage.getItem('stillMoreVideos')===null ? true: JSON.parse(localStorage.getItem('stillMoreVideos'));

let isNowIntersecting = false;


const loaderOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
}

const createNewCard = (video) => {
  const videoCard = document.createElement('div');
  videoCard.classList.add('eachVideo');
  videoCard.innerHTML = `
          <div class="videoThumbnail">
            <img src="/images/gridBg.webp" alt="videoThumbnail" />
          </div>
          ${(video.cost !== "free")?
          `<div class="premiumVideo">
          <img src="/images/otherIcons/premium.svg" alt="premium video" />
          </div>`
          :''
           }
          <div class="videoDetails">
            <h3>${video.level}</h3>
            <p>${video.title}</p>
            <p>TOPIC: ${video.topic}</p>
            <div class="coloredTitle">${video.subject}</div>
            <div class="playButton">
              ${video.cost ==='free'?`<a
                class="lesson"
                href="/dashboard/free/video/playnow/${video._id}"
              >
                <button class="watchVideo">
                  <img src="/images/otherIcons/playIcon.svg" alt="playIcon" />
                </button>
              </a>`
             :
              `<a
                class="lesson"
                href="/dashboard/subscriptions/video/playnow/${video._id}"
              >
                <button class="watchVideo">
                  <img src="/images/otherIcons/playIcon.svg" alt="playIcon" />
                </button>
              </a>`
              }
            </div>
          </div>
        </div>`;

    return videoCard;
  }

  const filterVideoByCategory = (videos) => {
    const categoryFilters = JSON.parse(localStorage.getItem('categoryFilters'));
    if(categoryFilters === null){
      return;
    }
    if (categoryFilters.all) {
      return videos;
    }
    if(categoryFilters.free){
      return videos.filter(video => video.cost === 'free');
    }
    if(categoryFilters.paid){
      return videos.filter(video => video.cost === 'paid');
    }
  }

  const filterVideoBySubject = (videos) => {
    const subjectFilters = JSON.parse(localStorage.getItem('subjectFilters'));
    if(subjectFilters === null){
      return;
    }
    if (subjectFilters.all) {
      return videos;
    }
    if(subjectFilters.mathematics){
      return videos.filter(video => video.subject === 'mathematics');
    }
    if(subjectFilters.english){
      return videos.filter(video => video.subject === 'english');
    }
    if(subjectFilters.physics){
      return videos.filter(video => video.subject === 'physics');
    }
    if(subjectFilters.chemistry){
      return videos.filter(video => video.subject === 'chemistry');
    }
    if(subjectFilters.biology){
      return videos.filter(video => video.subject === 'biology');
    }
    if(subjectFilters.history){
      return videos.filter(video => video.subject === 'history');
    }
  }



const filterVideos = async(videos) => {
  let filteredVideos = await filterVideoBySubject(filterVideoByCategory(videos));
  localStorage.setItem('filteredVideos', JSON.stringify(filteredVideos));
   return displayVideos(filteredVideos);

}

const displayVideos = (videos) => {
  allVideoBody.innerHTML = '';
  videos.forEach(video => {
    allVideoBody.appendChild(createNewCard(video));
  });
  setTimeout(async () => {
    loaderObserver.observe(loader);
  if(stillMoreVideos && isNowIntersecting){
    await loadVideos();
  }

  if(!stillMoreVideos){
    loaderObserver.unobserve(loader);
    loader.style.display = 'none';
    noMoreVideos.style.display = 'block';
  }
  }, 1000);

}


const loadVideos = async () => {
  try {
   const response = await fetch(`/moreVideos?skip=${skip}`);
    const videos = await response.json();
    if(videos.length === 0){
      stillMoreVideos = false;
      localStorage.setItem('stillMoreVideos', stillMoreVideos);
      loaderObserver.unobserve(loader);
      loader.style.display = 'none';
      noMoreVideos.style.display = 'block';
      return filterVideos(JSON.parse(localStorage.getItem('allVideos')));
    }
    moreVideos = [...moreVideos, ...videos];
    localStorage.setItem('allVideos', JSON.stringify(moreVideos));
    skip = moreVideos.length;
    localStorage.setItem('skip', skip);
    filterVideos(moreVideos);
  } catch (error) {
    console.log(error);
    
  }
}


const loaderObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting ){
      isNowIntersecting = true;
      loadVideos();
    }

    if (!entry.isIntersecting) {
      isNowIntersecting = false
    }

  })

}, loaderOptions);

const updateCheckBoxes = () => {
  categoryCheckbox.forEach(checkbox=>{
    checkbox.checked = categoryFilters[checkbox.value];
  })
  subjectCheckbox.forEach(checkbox=>{
    checkbox.checked = subjectFilters[checkbox.value];
  })
}

categoryCheckbox.forEach(checkbox=>{
  checkbox.addEventListener('change', (e)=>{
    Object.keys(categoryFilters).forEach(function(key, value) {
      return categoryFilters[key] = false;
    })
    if(e.target.value === checkbox.getAttribute('data-category')){
      categoryFilters[e.target.value] = true;
    }
    categoryCheckbox.forEach(checkbox=>{
      checkbox.checked = categoryFilters[checkbox.value];
    })
    localStorage.setItem('categoryFilters', JSON.stringify(categoryFilters));
    const videos = JSON.parse(localStorage.getItem('allVideos'));
    filterVideos(videos);
  })
})

subjectCheckbox.forEach(checkbox=>{
  checkbox.addEventListener('change', (e)=>{
    Object.keys(subjectFilters).forEach(function(key, value) {
      return subjectFilters[key] = false;
    })
    if(e.target.value === checkbox.getAttribute('data-subject')) {
      subjectFilters[e.target.value] = true
    }
    subjectCheckbox.forEach(checkbox=>{
      checkbox.checked = subjectFilters[checkbox.value];
    })
    localStorage.setItem('subjectFilters', JSON.stringify(subjectFilters));
    const videos = JSON.parse(localStorage.getItem('allVideos'));
    filterVideos(videos);
  })
});



document.addEventListener('DOMContentLoaded', async () => {

  localStorage.setItem('allVideos', JSON.stringify(moreVideos));
  localStorage.setItem('skip', skip);
  localStorage.setItem('filteredVideos', JSON.stringify(filteredVideos));
  localStorage.setItem('categoryFilters', JSON.stringify(categoryFilters));
  localStorage.setItem('subjectFilters', JSON.stringify(subjectFilters));
  localStorage.setItem('stillMoreVideos', JSON.stringify(stillMoreVideos));
  updateCheckBoxes()
  filterVideos(moreVideos);
  loaderObserver.observe(loader);
});



window.onbeforeunload = function() {
  localStorage.removeItem('allVideos');
  localStorage.removeItem('skip');
  localStorage.removeItem('filteredVideos');
  localStorage.removeItem('categoryFilters');
  localStorage.removeItem('subjectFilters');
  localStorage.removeItem('stillMoreVideos');

}













  