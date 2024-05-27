const modelRepository = require('./model.repository');
const utils = require('../../utils');

async function checkIfModelExists(id) {
  return modelRepository.checkIfModelExists(id);
}

async function getModelsByMake(make) {
  if (!utils.isValidObjectId(make)) {
    throw new Error('Make not found');
  }

  return modelRepository.getModelsByMake(make);
}

module.exports = {
  checkIfModelExists,
  getModelsByMake,
};
