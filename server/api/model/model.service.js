const modelRepository = require('./model.repository');
const utils = require('../../utils');

async function checkIfModelExistsByFilters(filters) {
  return modelRepository.checkIfModelExistsByFilters(filters);
}

async function getModelsByMake(make) {
  if (!utils.isValidObjectId(make)) {
    throw new Error('Make not found');
  }

  return modelRepository.getModelsByMake(make);
}

async function getModelById(make) {
  return modelRepository.getModelById(make);
}

module.exports = {
  checkIfModelExistsByFilters,
  getModelsByMake,
  getModelById,
};
