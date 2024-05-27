const Make = require('./make.model');

async function checkIfMakeExistsByFilters(filters) {
  return Make.exists({ _id: filters.make, model: filters.make });
}

// async function getMakesWithModels() {

// }

async function getAllMakes() {
  return Make.find({}).sort({ name: 1 });
}

module.exports = {
  checkIfMakeExistsByFilters,
  getAllMakes,
};
