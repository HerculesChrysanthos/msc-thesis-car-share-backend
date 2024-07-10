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

    if (error.toString().includes('duplicate key')) {
      error.message = `Το αυτοκίνητο με πινακίδες  ${req.body.registrationPlate} υπάρχει ήδη`;
      error.status = 409;
    }

    return next(error);
  }
}

async function updateCarSpecificFields(req, res, next) {
  try {
    const car = req.body;
    const carId = req.params.carId;
    const existingCar = req.car;

    const updatedCar = await carService.updateCarSpecificFields(
      carId,
      car,
      existingCar
    );

    return res.status(200).json(updatedCar);
  } catch (error) {
    return next(error);
  }
}

async function uploadCarImage(req, res, next) {
  try {
    const image = req.files[0];
    const user = req.user._id;
    const carId = req.params.carId;
    const setThumbnail = req.body.setThumbnail
      ? JSON.parse(req.body.setThumbnail)
      : false;

    if (req.car.images.length === 10) {
      const error = new Error('Μπορείς να ανεβάσεις μέχρι και 10 φωτογραφίες');
      error.status = 400;
      throw error;
    }

    const updatedCar = await carService.uploadCarImage(
      carId,
      image,
      user,
      setThumbnail
    );

    return res.status(201).json(updatedCar);
  } catch (error) {
    return next(error);
  }
}

async function deleteCarImage(req, res, next) {
  try {
    const imageId = req.params.imageId;
    const carId = req.params.carId;
    const existingCar = req.car;

    const updatedCar = await carService.removeCarImage(
      carId,
      imageId,
      existingCar
    );

    return res.status(200).json(updatedCar);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createCar,
  updateCarSpecificFields,
  uploadCarImage,
  deleteCarImage,
};
