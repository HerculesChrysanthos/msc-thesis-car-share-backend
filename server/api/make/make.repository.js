const Make = require('./make.model');

async function checkIfMakeExists(make) {
  return Make.exists({ _id: make });
}

// async function getMakesWithModels() {

// }

async function getAllMakes() {
  return Make.find({}).sort({ name: 1 });
}

async function getMakeById(makeId) {
  return Make.findById(makeId);
}

module.exports = {
  checkIfMakeExists,
  getAllMakes,
  getMakeById,
};
