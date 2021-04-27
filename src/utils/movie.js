// Require and configure dotenv
require('dotenv').config();
// Request
const request = require('request');

const apiKey = process.env.API_KEY;



const getMovies = (searchTerm, callback) => {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${searchTerm}`;

  request({ url: url }, (error, response, body) => {
    const results = JSON.parse(body).results[0];
    // console.log(results);
    if (error) {
      callback('Unable to connect to Movie database', undefined);
    } else if (results === undefined || results.original_title === undefined) {
      callback('Unable to find a movie. Try another search ', undefined);
    } else {
      callback(undefined, {
        // information api will have
        movie_title: results.original_title,
        release_data: results.release_date,
        image: results.poster_path,
        movie_description: results.overview,
        vote: results.vote_average,
        data: results,
      });
    }
  });
};

module.exports = getMovies;
