const makeRepository = require('./make.repository');

async function checkIfMakeExistsByFilters(filters) {
  return makeRepository.checkIfMakeExistsByFilters(filters);
}

async function getAllMakes() {
  return makeRepository.getAllMakes();
}

module.exports = {
  checkIfMakeExistsByFilters,
  getAllMakes,
};
