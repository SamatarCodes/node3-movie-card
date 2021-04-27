// Core module
const path = require('path');
// NPM modules
const express = require('express');
const hbs = require('hbs');
// livereload
const livereload = require('livereload');
// Middleware connectLiveReload
const connectLivereload = require('connect-livereload');
// Request
const request = require('request');

// |||||||||||||||||||||||||||||||||||||||||||||||||||
const app = express();

// Setup environment for port
const port = process.env.PORT || 3000;

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 30 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  // message: 'Too many requests, try again later',
});

// movie instance
const getMovies = require('./utils/movie');

// ||||||||||||||||||||||||||||||||||||||||||||||||||||
// Setup path for public folder
const publicDirectoryPath = path.join(__dirname, '../public');

// Setup the path for templates
const viewsPath = path.join(__dirname, '../templates/views');

const liveReloadServer = livereload.createServer();

// livereload to watch the public folder for changes
liveReloadServer.watch(publicDirectoryPath);
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// Rate limiter
app.set('trust proxy', 1);
// Use the connect reloader
app.use(connectLivereload());

// Pointing express to our custom directory
app.set('views', viewsPath);
app.set('view engine', 'hbs');

app.use(express.static(publicDirectoryPath));
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
app.get('', (req, res) => {
  res.render('index', {
    movie: 'Favorite Movie',
  });
});

// ! Connect to API
app.get('/movies', limiter, (req, res) => {
  // if there is no search term
  if (!req.query.search) {
    return res.send({
      error: 'You must search for a movie',
    });
  }
  // Check if rateLimit has passed,
  if (req.rateLimit.remaining <= 0) {
    return res.send({
      error: 'Too many request, try again later',
      error2: req.rateLimit,
    });
  }
  // call the movie function
  // Make a request to movie api
  getMovies(req.query.search, (error, data) => {
    if (error) {
      return res.send({
        error,
      });
    } else if (data) {
      return res.send({
        data,
      });
    }
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404 page',
    errorMessage: 'Page not found',
  });
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
