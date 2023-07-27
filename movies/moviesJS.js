// Movie Titles: https://omdbapi.com/?s=thor&page=1&apikey=d3fa2737
// Movie Details: https://www.omdbapi.com/?i=tt3896198&plot=full&apikey=d3fa2737
// Recent news: https://movies-news1.p.rapidapi.com/movies_news/recent

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const newsResults = document.getElementById('news-grid');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=d3fa2737`;

    try {
        const res = await fetch(URL);
        const data = await res.json();
        
        if (data.Response === "True") {
          displayMovieList(data.Search);
        }
        
      } catch (error) {
        console.error('Error loading movies:', error);
      }
    }

//This function is called in HTML
function findMovies(){
    const searchTerm = (movieSearchBox.value).trim();
    // console.log(searchTerm);

    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);

    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
  
    movies.forEach((movie) => {
      const movieListItem = document.createElement('div');
      movieListItem.dataset.id = movie.imdbID;
      movieListItem.classList.add('search-list-item');
      // console.log(movieListItem);
  
      const moviePoster = movie.Poster !== "N/A" ? movie.Poster : "images/image_not_found.png";
  
      movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
          <img src="${moviePoster}">
        </div>
        <div class="search-item-info">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
        </div>
      `;
  
      searchList.appendChild(movieListItem);
    });
  
    loadMovieDetails();
  }

  function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    
    searchListMovies.forEach((movie) => {
      movie.addEventListener('click', async () => {
        try {
          searchList.classList.add('hide-search-list');
          movieSearchBox.value = "";

          const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=d3fa2737`);  //for extra details about the movie add: &plot=full
          const movieDetails = await result.json();
          
          displayMovieDetails(movieDetails);
        } catch (error) {
          console.error('Error loading movie details:', error);
        }
      });
    });
  }

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class="card">
        <div class = "movie-poster card2">
            <img src = "${(details.Poster != "N/A") ? details.Poster : "images/image_not_found.png"}" alt = "movie poster">
        </div>
    </div>

    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "director"><b>Director:</b> ${details.Director}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <ul class = "movie-misc-info br">
          <li class = "language"><b>Language:</b> ${details.Language}</li>
          <li class = "runtime language"><b>Runtime:</b> ${details.Runtime}</li>
        </ul>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
    
    // loadNews();
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});


async function loadNews(){
    const URL = `https://movies-news1.p.rapidapi.com/movies_news/recent`;
    const options = {
        method: "GET",
        headers: {
            'X-RapidAPI-Key': "f70e757e98msh3331fac98972da5p1f46fejsn25106c92419c",
            'X-RapidAPI-Host': "movies-news1.p.rapidapi.com"
        }
    };

    try {
        const result = await fetch(URL, options);
        const news = await result.json();
        displayNews(news);
      } catch (error) {
        console.error('Error loading news:', error);
      }
    }

function displayNews(news){

    if (news.length === 0) {
        newsResults.innerHTML = "<p>No news articles found.</p>";
        return;
      }
    
      const fragment = document.createDocumentFragment();
      const maxArticles = Math.min(9, news.length); // Get the minimum value between 9 and the number of news elements received
  
      for (let i = 0; i < maxArticles; i++) {
        const date = news[i].date.substring(0, 16);
        const article = document.createElement('article');
        
        article.innerHTML = `
          <a href="${news[i].link}">
            <h2>${news[i].title}</h2>
            <img src="${news[i].image}" alt="Image not found">
          </a>
          <p id="date">${date}</p>
          <p>${news[i].description}</p>
        `;
    
        fragment.appendChild(article);
      }
      
      newsResults.innerHTML = "";
      newsResults.appendChild(fragment);
    }

// loadNews();