const categories = [];


//Select
const elSelectCategory = document.querySelector(".select-js");
const templateOption = document.querySelector(".option-temp").content;

//List
const elList = document.querySelector(".movies-collection");
const templateFragment = document.querySelector(".movie-temp").content;

//Search form
const elSearchForm = document.querySelector(".search-form");
const elSearchInput = elSearchForm.querySelector(".search-input");

const elSearchYearForm = document.querySelector(".search-year-form");
const elStartYearInput = elSearchYearForm.querySelector(".start-year");
const elEndYearInput = elSearchYearForm.querySelector(".end-year");

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

const sliceMovies = fullMovies.slice(0, 20);

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

    elList.innerHTML = "";
    movies.forEach(movie => {
        templateFragmentClone = templateFragment.cloneNode(true);

        templateFragmentClone.querySelector(".movie-img").src = movie.yt_img_md;
        templateFragmentClone.querySelector(".movie-title").textContent = movie.title;
        templateFragmentClone.querySelector(".movie-year").textContent = movie.year;
        templateFragmentClone.querySelector(".movie-rating").textContent = movie.imdb_rating;
        templateFragmentClone.querySelector(".movie-duration").textContent = getDuration(movie.runtime);
        templateFragmentClone.querySelector(".category").textContent = getSplitCategory(movie.categories);
        templateFragmentClone.querySelector(".info-btn").dataset.ytid = movie.ytid;

        fragment.appendChild(templateFragmentClone);
    })

    elList.appendChild(fragment);
}

elSearchYearForm.addEventListener("submit", searchYear)

function searchYear(evt){
    evt.preventDefault();
    const startInputValue = Number(elStartYearInput.value.trim())
    const endInputValue = Number(elEndYearInput.value.trim());
    console.log(startInputValue, endInputValue  )
    const searchYearMovie = fullMovies.filter(item => ((startInputValue <= item.year && endInputValue >= item.year) || (startInputValue == "" && endInputValue >= item.year) || (startInputValue <= item.year && endInputValue == "")));
    if (searchYearMovie.length > 0){
        viewMovie(searchYearMovie);
    }  else {
        elList.innerHTML = "Movie not found !!!"

    }
}


//Qidirilgan kinoni topish
elSearchForm.addEventListener("submit", searchFunc);

//Qidirilgan kinoni topish funksiyasi
function searchFunc(evt){
    evt.preventDefault();
    const searchInputValue = elSearchInput.value.trim();

    const regexTitle = new RegExp(searchInputValue, "gi");
    const searchMovie = fullMovies.filter(item => item.title.match(regexTitle));
        if(searchMovie.length > 0){
            viewMovie(searchMovie);
        }  else{
            elList.innerHTML = "Movie not found !!!"
        }
    // const searchYear = fullMovies.filter(item => );
    // if(searchYear.length > 0){
    //     viewMovie(searchYear);
    // }  else{
    //     elList.innerHTML = "Movie not found !!!"
    // }
}


//Category bo'yicha saralash
elSelectCategory.addEventListener("click", searchCategories)

//Category bo'yicha saralash funksiyasi
function searchCategories(){
    const selectValue = elSelectCategory.value
    const searchCategory = fullMovies.filter(item => item.categories.match(selectValue));
    if (searchCategory.length > 0){
        viewMovie(searchCategory);
    }   else{
        viewMovie(sliceMovies);
    }
}

//Categorylarni arrayga push qilib olish
fullMovies.forEach(allObj => {
    allObj.categories.split("|").forEach(allCategories => {
        if (!categories.includes(allCategories)){
            categories.push(allCategories);
        }
    })
});

//Push qilingan categorylarni domga chizish
function renderCategories(){
    categories.forEach(category => {
        const templateOptionClone = templateOption.cloneNode(true);
        templateOptionClone.querySelector(".category-option").textContent = category;
        templateOptionClone.querySelector(".category-option").value = category;

        fragment.appendChild(templateOptionClone);
    });
    elSelectCategory.appendChild(fragment);
}

//Aynan qaysi object ekanligini topib olish
elList.addEventListener("click", function(evt){
    const getTargetEl = evt.target;
    if(getTargetEl.matches(".info-btn")){
        const btnId = getTargetEl.dataset.ytid;
        const foundMovie = fullMovies.find(movie => movie.ytid == btnId);
        modalInfo(foundMovie);
    }
})

//Topilgan objectni modalga chizish
function modalInfo(foundMovie){
    modalTitle.textContent = foundMovie.title;
    modalIframe.src = foundMovie.yt_iframe;
    modalRating.textContent = foundMovie.imdb_rating;
    modalYear.textContent = foundMovie.year;
    modalRuntime.textContent = getDuration(foundMovie.runtime);
    modalCategories.textContent = foundMovie.categories.split("|").join(", ");
    modalSummary.textContent = foundMovie.summary;
    modalLink.href = foundMovie.imdb_link;
}

//Modalda qolib iframeni srcni tozalab yuborish
elModal.addEventListener("hide.bs.modal", function(){
    modalIframe.src = "";
});


renderCategories();
viewMovie(sliceMovies);




