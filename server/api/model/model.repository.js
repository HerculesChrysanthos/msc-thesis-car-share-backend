const Model = require('./model.model');

async function checkIfModelExists(id) {
  return Model.exists({ _id: id });
}

async function getModelsByMake(make) {
  return Model.find({ make }).sort({ name: -1 });
}

module.exports = {
  checkIfModelExists,
  getModelsByMake,
};
