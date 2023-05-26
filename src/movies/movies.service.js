const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// build a query that selects all columns from movies
function listAll() {
  return knex("movies").select("*");
}


// build query checks the movies_theaters table to retrieve movies currently showing in theaters
function moviesCurrentlyShowing() {
  return knex("movies")
    .join(
      "movies_theaters",
      "movies_theaters.movie_id",
      "movies.movie_id"
    )
    .distinct("movies.*")
    .where({ "movies_theaters.is_showing": true });
}

module.exports = {
  listAll,
  moviesCurrentlyShowing,
};
