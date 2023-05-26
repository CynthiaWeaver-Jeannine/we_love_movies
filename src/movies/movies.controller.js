const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
    const { is_showing = null } = req.query;
  
    try {
      // show list of movies that has query "?is_showing=true"
      // else list all movies
      if (is_showing) {
        const data = await moviesService.moviesCurrentlyShowing();
        res.json({ data });
      } else {
        const data = await moviesService.listAll();
        res.json({ data });
      }
    } catch (error) {
      next(error);
    }
  }

module.exports = {
  list: asyncErrorBoundary(list),
};
