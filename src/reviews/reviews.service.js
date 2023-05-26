const { select } = require("../db/connection");
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// get review data at reviewId
function read(reviewId) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
};

// update movie review at movieId
function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview);
};

// helper function for reviewWithCritics()
const addCriticInformation = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

// retrieve review with critic info
async function reviewWithCritics(reviewId) {
  return knex("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select("*")
    .where({ review_id: reviewId })
    .first()
    .then(addCriticInformation);
};

// delete a review
const destroy = (reviewId) => {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .del();
};

module.exports = {
  read,
  update,
  reviewWithCritics,
  destroy,
};