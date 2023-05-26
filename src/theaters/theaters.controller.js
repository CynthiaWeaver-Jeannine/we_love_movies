const theatersService = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// list all theaters and their movies
// call list() from theaters.service.js
async function list(req, res) {
  const data = await theatersService.list();
  res.json({ data });
};

module.exports = {
  list: asyncErrorBoundary(list),
};