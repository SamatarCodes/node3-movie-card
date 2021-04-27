const form = document.querySelector('form');
const movieName = document.querySelector('.card__title');
const movieRelease = document.querySelector('.movie__release');
const image = document.querySelector('.banner__image');
const movieDescription = document.querySelector('.card__description');
const movieDate = document.querySelector('.card__movie_release');

const fetchMovies = async (searchTerm) => {
  // clear the DOM data at each fetch request
  movieName.textContent = '';
  // movieRelease.textContent = '';
  movieDescription.textContent = '';
  image.src = '';
  movieDate.innerHTML = '';

  // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  const url = `/movies?search=${searchTerm}`;

  try {
    const response = await fetch(url);
    const data = await response.json(); //
    // If there's an error then..
    if (data.error) {
      // display it
      movieName.textContent = data.error;
      console.log(data);
      // show no image photo
      image.src = './images/nophoto.jpg';
    } else {
      // else display the...
      // title
      movieName.textContent = data.data.movie_title;
      // Movie description
      movieDescription.textContent = data.data.movie_description;
      // Movie image

      if (data.data.image === null) {
        image.src = './images/nophoto.jpg';
      } else {
        image.src = `https://image.tmdb.org/t/p/w500/${data.data.image}`;
      }
      // movie release date and vote
      movieDate.innerHTML = `
      <div>Release date: <span class="date">${data.data.release_data}</span></div>
            <div>Vote: <span class="vote">${data.data.vote}</span></div>
      `;
    }
    // Insert it just before the movie description
    movieDescription.parentNode.insertBefore(
      movieDate,
      movieDescription.previousSibling
    );
  } catch (error) {
    // check if there's an error on url or any other error
    console.log(error);
    movieName.textContent =
      'Check website URL/network connection/Too many requests';
    image.src = './images/nophoto.jpg';
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = form.movie.value;
  fetchMovies(searchTerm);

  // Clear the searchTerm
  form.movie.value = '';
});
