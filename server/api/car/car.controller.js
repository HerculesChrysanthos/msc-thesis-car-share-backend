const carService = require('./car.service');
const makeService = require('../make/make.service');
const modelService = require('../model/model.service');

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

    if (error.toString().includes('Το αυτοκίνητο δε βρέθηκε')) {
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

    let makeFound;
    let modelFound;

    result[0].searchTerms = {
      startDate,
      endDate,
      lat,
      long,
      page,
      limit,
      maxPrice,
      minPrice,
      gearboxType,
    };

    if (make) {
      makeFound = await makeService.getMakeById(make);
      result[0].searchTerms.make = makeFound.name;
    }

    if (model) {
      modelFound = await modelService.getModelById(model);
      result[0].searchTerms.model = modelFound.name;
    }

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

async function getCarsByOwnerId(req, res, next) {
  try {
    const userId = req.params.userId;
    const { page, limit } = req.query;

    const pageSize = limit ? Number(limit) : 9;
    const skipSize = page ? (Number(page) - 1) * pageSize : 0;

    const cars = await carService.getCarsByOwnerId(userId, skipSize, pageSize);

    return res.status(200).json(cars);
  } catch (error) {
    if (error.toString().includes('δε βρέθηκε')) {
      error.status = 404;
    }

    return next(error);
  }
}

async function disableCar(req, res, next) {
  try {
    await carService.disableCar(req.params.carId, req.car);

    return res.status(204).json({});
  } catch (error) {
    if (
      error
        .toString()
        .includes(
          'Δεν μπορείς να διαγράψεις αυτοκίνητο που έχει ενεργή κράτηση'
        )
    ) {
      error.status = 409;
    }
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
  getCarsByOwnerId,
  disableCar,
};
