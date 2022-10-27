const elList = document.querySelector(".movies-collection");
const templateFragment = document.querySelector(".movie-temp").content;

//Search form
const elSearchForm = document.querySelector(".search-form");
const elSearchInput = document.querySelector(".search-input");

//Modal
const elModal = document.querySelector(".modal-js");
const modalTitle = elModal.querySelector(".modal-title");
const modalIframe = elModal.querySelector(".modal-iframe");
const modalRating = elModal.querySelector(".modal-rating");
const modalYear = elModal.querySelector(".modal-year");
const modalRuntime = elModal.querySelector(".modal-runtime");
const modalCategories = elModal.querySelector(".category-text");
const modalSummary = elModal.querySelector(".modal-summary");
const modalLink = elModal.querySelector(".modal-imdb-link");

const fragment = new DocumentFragment();

const sliceMovies = movies.slice(0, 100);

//Minutni soatga aylantirish
function getDuration(time){
    const hour = Math.floor(time / 60);
    const minutes = Math.floor(time % 60);
    return `${hour} hrs, ${minutes} min`
}

//Categoriesni orasini ochish
function getSplitCategory(text){
    return text.split("|").join(", ");
}

//Objectni DOMga chiqarish
function viewMovie(movies){
    movies.forEach(movie => {
        templateFragmentClone = templateFragment.cloneNode(true);

        templateFragmentClone.querySelector(".movie-img").src = `http://i3.ytimg.com/vi/${movie.ytid}/mqdefault.jpg`;
        templateFragmentClone.querySelector(".movie-title").textContent = movie.Title;
        templateFragmentClone.querySelector(".movie-year").textContent = movie.movie_year;
        templateFragmentClone.querySelector(".movie-rating").textContent = movie.imdb_rating;
        templateFragmentClone.querySelector(".movie-duration").textContent = getDuration(movie.runtime);
        templateFragmentClone.querySelector(".category").textContent = getSplitCategory(movie.Categories);
        templateFragmentClone.querySelector(".info-btn").dataset.ytid = movie.ytid;

        fragment.appendChild(templateFragmentClone);
    })

    elList.appendChild(fragment);
}

//Qidirilgan kinoni topish
elSearchForm.addEventListener("submit", searchFunc)

//Qidirilgan kinoni topish funksiyasi
function searchFunc(evt){
    evt.preventDefault();
    const searchInputValue = elSearchInput.value.trim().toUpperCase();

    if (searchInputValue != ""){
        elList.innerHTML = null;
        movies.forEach(movie => {
            const movieName = ""+movie.Title;
            if (movieName.toUpperCase().indexOf(searchInputValue) > -1 ){
                templateFragmentClone = templateFragment.cloneNode(true);

                templateFragmentClone.querySelector(".movie-img").src = `http://i3.ytimg.com/vi/${movie.ytid}/mqdefault.jpg`;
                templateFragmentClone.querySelector(".movie-title").textContent = movie.Title;
                templateFragmentClone.querySelector(".movie-year").textContent = movie.movie_year;
                templateFragmentClone.querySelector(".movie-rating").textContent = movie.imdb_rating;
                templateFragmentClone.querySelector(".movie-duration").textContent = getDuration(movie.runtime);
                templateFragmentClone.querySelector(".category").textContent = getSplitCategory(movie.Categories);

                fragment.appendChild(templateFragmentClone);
            }
        });
        elList.appendChild(fragment);
    }
    else {
        viewMovie(sliceMovies);
    }
}

//Aynan qaysi object ekanligini topib olish
elList.addEventListener("click", function(evt){
    const getTargetEl = evt.target;
    if(getTargetEl.matches(".info-btn")){
        const btnId = getTargetEl.dataset.ytid;
        const foundMovie = movies.find(movie => movie.ytid == btnId);
        modalInfo(foundMovie);
        }
})

//Topilgan objectni modalga chizish
function modalInfo(foundMovie){
    modalTitle.textContent = foundMovie.Title;
    modalIframe.src = `https://www.youtube-nocookie.com/embed/${foundMovie.ytid}`;
    modalRating.textContent = foundMovie.imdb_rating;
    modalYear.textContent = foundMovie.movie_year;
    modalRuntime.textContent = getDuration(foundMovie.runtime);
    modalCategories.textContent = foundMovie.Categories.split("|").join(", ");
    modalSummary.textContent = foundMovie.summary;
    modalLink.href = `https://www.imdb.com/title/${foundMovie.imdb_id}`;
}

//Modalda qolib iframeni srcni tozalab yuborish
elModal.addEventListener("hide.bs.modal", function(){
    modalIframe.src = "";
})

viewMovie(sliceMovies);



