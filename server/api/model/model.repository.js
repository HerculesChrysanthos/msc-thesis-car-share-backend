const Model = require('./model.model');

async function checkIfModelExistsByFilters(filters) {
  return Model.exists({ _id: filters.model, make: filters.make });
}

async function getModelsByMake(make) {
  return Model.find({ make }).sort({ name: -1 });
}

async function getModelById(modelId) {
  return Model.findById(modelId);
}

module.exports = {
  checkIfModelExistsByFilters,
  getModelsByMake,
  getModelById,
};
