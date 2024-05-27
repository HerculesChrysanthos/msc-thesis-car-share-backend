const Car = require('./car.model');

async function createCar(car) {
  return Car.create(car);
}

module.exports = {
  createCar,
};
