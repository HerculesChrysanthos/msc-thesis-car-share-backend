const carService = require('./car.service');

async function createCar(req, res, next) {
  try {
    const car = req.body;

    car.owner = req.user._id;

    const createdCar = await carService.createCar(car);

    return res.status(201).json(createdCar); // helper for output
  } catch (error) {
    if (error.toString().includes('not found')) {
      error.status = 404;
    }

    return next(error);
  }
}

module.exports = {
  createCar,
};
