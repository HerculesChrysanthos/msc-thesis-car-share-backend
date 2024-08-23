const makeRepository = require('./make.repository');

async function checkIfMakeExists(make) {
  return makeRepository.checkIfMakeExists(make);
}

async function getAllMakes() {
  return makeRepository.getAllMakes();
}

async function getMakeById(makeId) {
  return makeRepository.getMakeById(makeId);
}

module.exports = {
  checkIfMakeExists,
  getAllMakes,
  getMakeById,
};
