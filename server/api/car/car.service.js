const carRepository = require('./car.repository');
const modelService = require('../model/model.service');
const makeservice = require('../make/make.service');
const utils = require('../../utils');

async function createCar(car) {
  if (!utils.isValidObjectId(car.model) || !utils.isValidObjectId(car.make)) {
    throw new error('Ο κατασκευαστής ή το μοντέλο δε βρέθηκαν');
  }

  const make = await makeservice.checkIfMakeExists(car.make);

  if (!make) {
    throw new Error('Ο κατασκευαστής δε βρέθηκε');
  }

  const modleFilters = {
    model: car.model,
    make: car.make,
  };

  const model = await modelService.checkIfModelExistsByFilters(modleFilters);

  if (!model) {
    throw new Error('Το Μοντέλο δε βρέθηκε');
  }

  return carRepository.createCar(car);
}

module.exports = {
  createCar,
};
