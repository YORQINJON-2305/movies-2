const categories = [];
const localBookmark = JSON.parse(localStorage.getItem("bookmark"));
const bookmark = localBookmark || [];

//Select
const elSortSelect = document.querySelector(".sort-select");
const elSelectCategory = document.querySelector(".select-js");
const templateOption = document.querySelector(".option-temp").content;

//List
const elList = document.querySelector(".movies-collection");
const templateFragment = document.querySelector(".movie-temp").content;

//Bookmark
const elBookmarkList = document.querySelector(".bookmark-list");
const elTemplateBookmark = document.querySelector(".bookmark-temp").content;


//Search form
const elSearchForm = document.querySelector(".search-form");
const elSearchInput = elSearchForm.querySelector(".search-input");
const elStartYearInput = elSearchForm.querySelector(".start-year");
const elEndYearInput = elSearchForm.querySelector(".end-year");

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
function viewMovie(movies, regex=""){

    elList.innerHTML = "";
    movies.forEach(movie => {
        templateFragmentClone = templateFragment.cloneNode(true);

        templateFragmentClone.querySelector(".movie-img").src = movie.yt_img_md;
        if(regex.source != "(?:)" && regex){
        templateFragmentClone.querySelector(".movie-title").innerHTML = movie.title.replace(regex, `<mark class="bg-warning">${regex.source.toLowerCase()}</mark>`)
        } else {
        templateFragmentClone.querySelector(".movie-title").textContent = movie.title;
        }
        templateFragmentClone.querySelector(".movie-year").textContent = movie.year;
        templateFragmentClone.querySelector(".movie-rating").textContent = movie.imdb_rating;
        templateFragmentClone.querySelector(".movie-duration").textContent = getDuration(movie.runtime);
        templateFragmentClone.querySelector(".category").textContent = getSplitCategory(movie.categories);
        templateFragmentClone.querySelector(".info-btn").dataset.ytid = movie.ytid;
        templateFragmentClone.querySelector(".btn-bookmark").dataset.id = movie.imdb_id

        fragment.appendChild(templateFragmentClone);
    })

    elList.appendChild(fragment);
}

//Qidirilgan kinoni topish
elSearchForm.addEventListener("submit", searchFunc);

function showShowFilterArr(regex){
    const startInputValue = Number(elStartYearInput.value.trim())
    const endInputValue = Number(elEndYearInput.value.trim());
    const searchMovie = fullMovies.filter(item => {
        const filterArr = item.title.match(regex) &&
            (startInputValue == "" || item.year >= startInputValue) && (endInputValue == "" || item.year <= endInputValue) &&
            (elSelectCategory.value == "all" || item.categories.includes(elSelectCategory.value));
        return filterArr;
    });
    return searchMovie;
}

//Qidirilgan kinoni topish funksiyasi
function searchFunc(evt){
    evt.preventDefault();
    const searchInputValue = elSearchInput.value.trim();
    const regexTitle = new RegExp(searchInputValue, "gi");
    const sortSelectValue = elSortSelect.value;
    sortedFunction(fullMovies, sortSelectValue);

    const searchMovie = showShowFilterArr(regexTitle)

        if(searchMovie.length > 0){
            viewMovie(searchMovie, regexTitle);
        }  else{
            elList.innerHTML = "Movie not found !!!"
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

//Sortlash funksiyasi
function sortedFunction(movies, select){

    if(select === "a-z"){
        movies.sort((a,b) => {
            if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
              else if(a.title.toLowerCase() < b.title.toLowerCase()) return -1;
              return 0;
        });

    } else if(select === "z-a"){
        movies.sort((a,b) => {
            if(a.title.toLowerCase() > b.title.toLowerCase()) return -1;
              else if(a.title.toLowerCase() < b.title.toLowerCase()) return 1;
                return 0;
        })
    };

    if(select === "min-rating"){
        movies.sort((a,b) => a.imdb_rating - b.imdb_rating);
    } else if(select === "max-rating"){
        movies.sort((a,b) => b.imdb_rating - a.imdb_rating)
    }

    if(select === "start-year"){
        movies.sort((a,b) => a.year - b.year)
    } else if(select === "end-year"){
        movies.sort((a ,b) => b.year - a.year)
    }

    if(select === "min-duration"){
        movies.sort((a,b) => a.runtime - b.runtime)
    } else if(select === "max-duration"){
        movies.sort((a ,b) => b.runtime - a.runtime)
    }
}


//Bookmark
function renderBookmark(arr, list){
    list.innerHTML = "";
    arr.forEach(movie => {
        const templateBookmarkClone = elTemplateBookmark.cloneNode(true);

        templateBookmarkClone.querySelector(".movie-img-bookmark").src = movie.yt_img_md;
        templateBookmarkClone.querySelector(".movie-title-bookmark").textContent = movie.title;
        templateBookmarkClone.querySelector(".movie-year-bookmark").textContent = movie.year;
        templateBookmarkClone.querySelector(".movie-rating-bookmark").textContent = movie.imdb_rating;
        templateBookmarkClone.querySelector(".movie-duration-bookmark").textContent = getDuration(movie.runtime);
        templateBookmarkClone.querySelector(".category-bookmark").textContent = getSplitCategory(movie.categories);
        templateBookmarkClone.querySelector(".bookmark-remove").dataset.id = movie.imdb_id;

        fragment.appendChild(templateBookmarkClone);
    });
    localStorage.setItem("bookmark", JSON.stringify(bookmark));
    elBookmarkList.appendChild(fragment);
}


//Aynan qaysi object ekanligini topib olish
elList.addEventListener("click", function(evt){
    const getTargetEl = evt.target;
    if(getTargetEl.matches(".info-btn")){
        const btnId = getTargetEl.dataset.ytid;
        const foundMovie = fullMovies.find(movie => movie.ytid === btnId);
        modalInfo(foundMovie);
    }
    if(getTargetEl.matches(".btn-bookmark")){
        const btnId = getTargetEl.dataset.id;
        const foundMovie = fullMovies.find(movie => movie.imdb_id === btnId);
        if(!bookmark.includes(foundMovie)){
          bookmark.push(foundMovie);
          renderBookmark(bookmark, elBookmarkList);
        }
    }

    localStorage.setItem("bookmark", JSON.stringify(bookmark));
});

elBookmarkList.addEventListener("click", function (evt){
    if(evt.target.matches(".bookmark-remove")){
        const getBtnId = evt.target.dataset.id;
        const foundMovie = bookmark.findIndex(movie => movie.imdb_id === getBtnId);

        bookmark.splice(foundMovie, 1);
        renderBookmark(bookmark, elBookmarkList);
    }
        localStorage.setItem("bookmark", JSON.stringify(bookmark));
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

renderBookmark(bookmark, elBookmarkList)
renderCategories();
viewMovie(sliceMovies);





