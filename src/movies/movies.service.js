const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//list all movies
const list = () => {
  return knex("movies").select("*");
};

// list theaters showing movie by "is_showing = true"
const isShowing = () => {
  return knex("movies")
    .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
    .distinct("movies.*")
    .where({ "movies_theaters.is_showing": true });
};

// retrieve movie data for a specific id
const read = (movieId) => {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
};

// list movie reviews for specific movieId
// map through critics and map properties to object using mapProperties()
const listMovieReviews = (movieId) => {
  return knex("movies")
    .join("reviews", "movies.movie_id", "reviews.movie_id")
    .join("critics", "critics.critic_id", "reviews.critic_id")
    .select("reviews.*", "critics.*")
    .where({ "reviews.movie_id": movieId })
    .then((critics) => critics.map((critic) => addCriticInformation(critic))); 
};
//helper function used with listMovieReviews()
const addCriticInformation = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

// list theaters where with specific movie
function listTheatersWithMovie(movieId) {
  return knex("theaters")
    .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
    .select("*")
    .where({ "movies_theaters.movie_id": movieId });
};

module.exports = {
  list,
  isShowing,
  read,
  listMovieReviews,
  listTheatersWithMovie,
};