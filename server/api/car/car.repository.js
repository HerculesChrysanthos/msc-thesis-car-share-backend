const Car = require('./car.model');

async function createCar(car) {
  return Car.create(car);
}

async function findCarById(id) {
  return Car.findById(id).exec();
}

async function updateCarById(id, updates) {
  return Car.findByIdAndUpdate(id, { $set: updates }, { new: true });
}

module.exports = {
  createCar,
  findCarById,
  updateCarById,
};
