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

async function getCarById(req, res, next) {
  try {
    const car = await carService.getCarById(req.params.carId);

    return res.status(200).json(car);
  } catch (error) {
    if (error.toString().includes('not found')) {
      error.status = 404;
    }

    return next(error);
  }
}

async function findCarByFiltersAndByAvailabilityDays(req, res, next) {
  try {
    const {
      startDate,
      endDate,
      lat,
      long,
      page,
      limit,
      maxPrice,
      minPrice,
      make,
      model,
      gearboxType,
    } = req.query;

    const pageSize = limit ? Number(limit) : 9;
    const skipSize = page ? (Number(page) - 1) * pageSize : 0;

    const filters = {
      startDate,
      endDate,
      lat,
      long,
      skip: skipSize,
      limit: pageSize,
      maxPrice,
      minPrice,
      make,
      model,
      gearboxType,
    };

    const result = await carService.findCarByFiltersAndByAvailabilityDays(
      filters
    );

    return res.status(200).json(result);
  } catch (error) {
    if (
      error
        .toString()
        .includes(
          'Η αρχική ημερομηνία πρέπει να είναι προγενέστερη της τελικής'
        )
    ) {
      error.status = 422;
    }

    if (error.toString().includes('δε βρέθηκε')) {
      error.status = 404;
    }

    return next(error);
  }
}

async function getMyCars(req, res, next) {
  try {
    const userId = req.user._id;

    const cars = await carService.getMyCars(userId);

    return res.status(200).json(cars);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createCar,
  updateCarSpecificFields,
  uploadCarImage,
  deleteCarImage,
  getCarById,
  findCarByFiltersAndByAvailabilityDays,
  getMyCars,
};
