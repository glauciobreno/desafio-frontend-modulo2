const body = document.querySelector('body');
const btnTheme = document.querySelector('.btn-theme');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const searchInput = document.querySelector('.input');


let listMovies = [];

async function SeeMovies() {
  const { results } = await (
    await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false')
  ).json();
  let listResults = results;

  for (let i = 0; i < 2; i++) {
    let page = listResults.splice(0, 6);
    listMovies.push(page);
  }
  createMovies(listMovies[1]);
}
SeeMovies();

btnNext.addEventListener('click', moveNext);
btnPrev.addEventListener('click', movePrev);

let currentPage = 0;

function moveNext() {
  currentPage -= 1;
  if (currentPage < 0) {
    currentPage = listMovies.length - 1;
  }
  createMovies(listMovies[currentPage]);
}

function movePrev() {
  currentPage += 1;
  if (currentPage >= listMovies.length) {
    currentPage = 0;
  }
  createMovies(listMovies[currentPage]);
}

function createMovies(moviesArrays) {
  const movies = document.querySelector('.movies');
  movies.innerHTML = '';

  moviesArrays.forEach((item) => {
    const movie = document.createElement('div');
    movie.classList.add('movie');
    movie.style.backgroundImage = `url('${item.poster_path}')`;
    movie.id = item.id;
    movie.addEventListener('click', (event) => {
      moviesModal(event.target.id);
    });

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info');

    const movieTitle = document.createElement('span');
    movieTitle.classList.add('movie__title');
    movieTitle.innerText = item.title;

    const movieRating = document.createElement('span');
    movieRating.classList.add('movie__rating');
    movieRating.innerText = item.vote_average;

    const img = document.createElement('img');
    img.src = './assets/estrela.svg';
    img.alt = 'Estrela';

    movieRating.append(img);
    movieInfo.append(movieTitle, movieRating);
    movie.append(movieInfo);
    movies.append(movie);
    
  });
}

async function inputSearchMovies() {
  moviesList = [];
  if (!searchInput.value) {
    return SeeMovies();
  }
  const search = await (
    await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${searchInput.value}`)
  ).json();
  let listResults = search.results;

  for (let i = 0; i < 2; i++) {
    let page = listResults.splice(0, 6);
    moviesList.push(page);
  }
  createMovies(moviesList[0]);
}

searchInput.addEventListener('keydown', (key) => {
  if (key.key === 'Enter') {
    inputSearchMovies();
  }
});

async function movieDay() {
  try {
    const dayMovie = await apiAxios.get("discover/movie?language=pt-BR&include_adult=false");
    const movie = await apiAxios.get(`movie/${dayMovie.data.results[1].id}?language=pt-BR`);
    const trailer = await apiAxios.get(`movie/${dayMovie.data.results[1].id}/videos?language=pt-BR`);

    const highlightVideo = document.querySelector(".highlight__video");
    highlightVideo.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5) 100%, rgba(0, 0, 0, 0.5) 100%), url(${movie.data.backdrop_path})` ?? `url(${".src/assets/imagem-indisponivel-para-produtos-sem-imagem_15_5.jpg"})`;
    highlightVideo.style.backgroundSize = "cover";

    const highlightTitle = document.querySelector(".highlight__title");
    highlightTitle.innerText = movie.data.title;

    const highlightRating = document.querySelector(".highlight__rating");
    highlightRating.innerText = (movie.data.vote_average).toFixed(1);

    const highlightGenres = document.querySelector(".highlight__genres");
    highlightGenres.innerText = movie.data.genres.map((genres) => genres.name).join(", ");

    const highlightLaunch = document.querySelector('.highlight__launch');
    highlightLaunch.innerText = new Date(movie.release_date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });

    const highlightDescription = document.querySelector(".highlight__description");
    highlightDescription.innerText = movie.data.overview;

    const highlightVideoLink = document.querySelector(".highlight__video-link");
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${trailer.data.results[0].key}`;

  } catch (erro) {
    console.error(erro.message);
  }
}
movieDay();

async function moviesModal(movieId) {
  const movie = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movieId}?language=pt-BR`)).json();

  const openModal = document.querySelector('.modal');
  openModal.classList.remove('hidden');

  const title = document.querySelector('.modal__title');
  title.innerText = movie.title;

  const img = document.querySelector('.modal__img');
  img.src = movie.backdrop_path;

  const description = document.querySelector('.modal__description');
  description.innerText = movie.overview;

  const rating = document.querySelector('.modal__average');
  rating.innerText = movie.vote_average.toFixed(1);

  const modalClose = document.querySelector('.modal__close');
  modalClose.addEventListener('click', () => {
    document.querySelector('.modal').classList.add('hidden');

  });

  const modalGenres = document.querySelector('.modal__genres');
  modalGenres.innerText = '';
  movie.genres.forEach((genre) => {
    const modalGenre = document.createElement('span');
    modalGenre.innerText = genre.name;
    modalGenre.classList.add('modal__genre');

    modalGenres.append(modalGenre);
  });
}