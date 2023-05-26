const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// retrieve movie with movieId from res.locals
async function read(req, res, next) {
  const { review: data } = res.locals;
  res.json({ data });
};

// update review and save review with critic info nested
// call update() and reviewWithCritics() from reviews.service.js
async function update(req, res) {
  const review_id = res.locals.review.review_id;
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
  };
  await reviewsService.update(updatedReview);
  const data = await reviewsService.reviewWithCritics(review_id);
  res.json({ data });
};

// validate if review exists with specific id
// call read() from reviews.service.js
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await reviewsService.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
};

// delete review
// call destroy() from reviews.service.js
async function destroy(req, res) {
  const { review } = res.locals;
  await reviewsService.destroy(review.review_id);
  res.sendStatus(204);
};

module.exports = {
  read: [asyncErrorBoundary(reviewExists), read],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), destroy],
};