const makeRepository = require('./make.repository');

async function checkIfMakeExists(make) {
  return makeRepository.checkIfMakeExists(make);
}

async function getAllMakes() {
  return makeRepository.getAllMakes();
}

module.exports = {
  checkIfMakeExists,
  getAllMakes,
};
