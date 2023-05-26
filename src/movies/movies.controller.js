const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// validate if movie exists with specific id
// call read() from movies.service.js
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await moviesService.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
};

// use try/catch to retrieve movies where is_showing is true; else list all movies
// call list() and isShowing() from movies.service.js
async function list(req, res, next) {
  const { is_showing = null } = req.query;
  try {    
    if (is_showing) {
      const data = await moviesService.isShowing();
      res.json({ data });
    } else {
      const data = await moviesService.list();
      res.json({ data });
    }
  } catch (error) {
    next(error);
  }
};

// retrieve movie, utilize validator "movieExists" 
async function read(req, res, next) {
  const { movie: data } = res.locals;
  res.json({ data });
};

// list movie reviews from movieId
async function listMovieReviews(req, res, next) {
  const movieId = res.locals.movie.movie_id;
  const data = await moviesService.listMovieReviews(movieId);
  res.json({ data });
};

// list theaters showing movies with movieId
async function listTheatersWithMovie(req, res, next) {
  const movieId = res.locals.movie.movie_id;
  const data = await moviesService.listTheatersWithMovie(movieId);
  res.json({ data });
};


module.exports = {
  list: asyncErrorBoundary(list),
  listMovieReviews: [asyncErrorBoundary(movieExists), listMovieReviews],
  read: [asyncErrorBoundary(movieExists), read],
  listTheatersWithMovie: [
    asyncErrorBoundary(movieExists),
    listTheatersWithMovie,
  ],
};