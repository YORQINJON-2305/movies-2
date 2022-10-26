const elList = document.querySelector(".movies-collection");
const templateFragment = document.querySelector(".movie-temp").content;
const fragment = new DocumentFragment();

const sliceMovies = movies.slice(0, 100)

for (const movie of sliceMovies) {
    templateFragmentClone = templateFragment.cloneNode(true);

    templateFragmentClone.querySelector(".movies-year").textContent = movie.movie_year;
    templateFragmentClone.querySelector(".movies-title").textContent = movie.Title;
    templateFragmentClone.querySelector(".info-text").textContent = movie.summary;
    templateFragmentClone.querySelector(".runtime").textContent = `${Math.floor(movie.runtime / 60)} hour, ${movie.runtime % 60} minutes`;
    templateFragmentClone.querySelector(".category").textContent = movie.Categories;
    templateFragmentClone.querySelector(".language").textContent = movie.language;

    fragment.appendChild(templateFragmentClone);
}

elList.appendChild(fragment)


