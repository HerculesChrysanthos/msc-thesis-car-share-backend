const mongoose = require('mongoose');
const carRepository = require('./car.repository');
const modelService = require('../model/model.service');
const makeservice = require('../make/make.service');
const utils = require('../../utils');
const generalHelper = require('../../helpers/general.helper');
const sharpHelper = require('../../helpers/sharp.helper');
const imagekitClient = require('../../clients/imagekit-client');
const moment = require('moment');
const userService = require('../user/user.service');
const bookingService = require('../booking/booking.service');
const availabilitiesService = require('../availability/availability.service');

async function createCar(car) {
  if (!utils.isValidObjectId(car.model) || !utils.isValidObjectId(car.make)) {
    throw new Error('Ο κατασκευαστής ή το μοντέλο δε βρέθηκαν');
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

  const createdCar = await carRepository.createCar(car);

  return carRepository.findCarByIdAndPopulateModelMake(createdCar?._id);
}

async function updateCarSpecificFields(carId, car, existingCar) {
  if (car.address) {
    car.address.location = {
      type: 'Point',
      coordinates: [car.address.long, car.address.lat],
    };
  }

  if (car.thumbnail) {
    const existingCarImage = existingCar.images?.find(
      (image) => image._id.toString() === car.thumbnail
    );

    if (!existingCarImage) {
      const error = new Error('Η φωτογραφία δε βρέθηκε');
      error.status = 404;
      throw error;
    }

    const image = await imagekitClient.getImage(existingCarImage.url);

    const resizedThumbnail = await sharpHelper.resizeImage(image.buffer, {
      width: 200,
      //height: 400,
    });

    const resizedName = `${Date.now()}${existingCarImage._id}_thumbnail`;

    const result = await imagekitClient.uploadImage(
      resizedThumbnail,
      resizedName
    );

    const thumbnailUrl = `https://ik.imagekit.io/carsharerentingapp/${resizedName}`;

    if (existingCar.thumbnail?.externalId) {
      imagekitClient.deleteImageByFileId(existingCar.thumbnail.externalId);
    }

    car.thumbnail = {
      url: thumbnailUrl,
      imageId: car.thumbnail,
      externalId: result.fileId,
    };
  }

  if (car.address && !existingCar.available && !existingCar.address.city) {
    car.isAvailable = true;

    availabilitiesService.createAvailabilities(carId);
  }

  return carRepository.updateCarById(carId, car);
}

async function uploadCarImage(carId, image, user, setImageAsThumbnail) {
  image.originalname = image.originalname.replace(/[^a-zA-Z0-9.]/g, '_');

  const name = generalHelper.prepareImageName(image.originalname, user);

  const resizedImage = await sharpHelper.resizeImage(image.buffer, {
    width: 400,
    //height: 400,
  });

  const result = await imagekitClient.uploadImage(resizedImage, name);

  const imageUrl = `https://ik.imagekit.io/carsharerentingapp/${name}`;

  const updatedCar = await carRepository.uploadCarImage(
    carId,
    imageUrl,
    result.fileId
  );

  if (setImageAsThumbnail) {
    if (updatedCar.thumbnail) {
      imagekitClient.deleteImageByFileId(updatedCar.thumbnail.externalId);
    }

    const addedImagedId = updatedCar.images?.find(
      (image) => image.url === imageUrl
    );

    const resizedThumbnail = await sharpHelper.resizeImage(image.buffer, {
      width: 200,
      //height: 400,
    });

    const resizedName = `${name}_thumbnail`;

    const resultThumbnail = await imagekitClient.uploadImage(
      resizedThumbnail,
      resizedName
    );

    const thumbnailUrl = `https://ik.imagekit.io/carsharerentingapp/${resizedName}`;

    return carRepository.addThumbnail(
      carId,
      thumbnailUrl,
      addedImagedId._id.toString(),
      resultThumbnail.fileId
    );
  }

  return updatedCar;
}

async function removeCarImage(id, imageId, existingCar) {
  const existingImage = existingCar.images.find(
    (image) => image._id.toString() === imageId
  );

  if (!existingImage) {
    const error = new Error('Η φωτογραφία δε βρέθηκε');
    error.status = 404;
    throw error;
  }

  if (existingCar.thumbnail?.imageId === imageId) {
    await imagekitClient.deleteImageByFileId(existingCar.thumbnail.externalId);
    await carRepository.removeCarThumbnail(id);
  }

  if (existingImage.externalId) {
    await imagekitClient.deleteImageByFileId(existingImage.externalId);
  }

  return carRepository.removeCarImage(id, imageId);
}

async function getCarById(carId) {
  if (!utils.isValidObjectId(carId)) {
    const error = new Error('Το αυτοκίνητο δε βρέθηκε');
    error.status = 404;
    throw error;
  }

  const carFound = await carRepository.findCarByIdAndPopulateModelMake(carId);

  if (!carFound && !carFound.isEnabled) {
    throw new Error('Το αυτοκίνητο δε βρέθηκε');
  }

  return carFound;
}

async function findCarByFiltersAndByAvailabilityDays(filters) {
  if (filters.make && !utils.isValidObjectId(filters.make)) {
    throw new Error('Ο κατασκευαστής δε βρέθηκε');
  }

  if (filters.model && !utils.isValidObjectId(filters.model)) {
    throw new Error('Το μοντέλο δε βρέθηκε');
  }

  filters.startDate = moment.utc(filters.startDate);
  filters.endDate = moment.utc(filters.endDate);

  const differenceInHours = filters.endDate.diff(filters.startDate, 'hours');

  if (differenceInHours <= 0) {
    throw new Error(
      'Η αρχική ημερομηνία πρέπει να είναι προγενέστερη της τελικής'
    );
  }
  return carRepository.findCarByFiltersAndByAvailabilityDays(
    filters,
    differenceInHours
  );
}

async function getMyCars(userId) {
  return carRepository.getMyCars(userId);
}

async function updateCarRatingScoreAndAmount(carId, score, amount) {
  return carRepository.updateCarRatingScoreAndAmount(carId, score, amount);
}

async function checkIfCarExists(carId) {
  if (!utils.isValidObjectId(carId)) {
    throw new Error('Το αυτοκίνητο δε βρέθηκε');
  }

  const foundCar = await carRepository.findCarById(carId);

  if (!foundCar && !foundCar.isEnabled) {
    throw new Error('Το αυτοκίνητο δε βρέθηκε');
  }
}

async function getCarsByOwnerId(userId, skip, limit) {
  const user = await userService.checkIfUserExists(userId);

  return carRepository.getCarsByOwnerId(user._id, skip, limit);
}

async function disableCar(carId, car) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const carBookings =
      await bookingService.findAcceptedAndPendingBookingsByCarId(
        carId,
        session
      );

    if (carBookings.length > 0) {
      throw new Error(
        'Δεν μπορείς να διαγράψεις αυτοκίνητο που έχει ενεργή κράτηση'
      );
    }

    await carRepository.disableCar(carId, session);

    await availabilitiesService.deleteAvailabilitiesByCarId(carId, session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  car.images.forEach((image) => {
    imagekitClient.deleteImageByFileId(image.externalId);
  });

  carRepository.updateCarById(carId, { images: [] });
}

async function changeCarStatus(carId, available) {
  const updatedCar = await carRepository.changeCarStatus(carId, available);

  if (available) {
    await availabilitiesService.createAvailabilities(carId);
  } else {
    await availabilitiesService.deleteCarAvailableAvailabilities(carId);
  }

  return updatedCar;
}

async function findAvailableCarsIds() {
  return carRepository.findAvailableCarsIds();
}

module.exports = {
  createCar,
  updateCarSpecificFields,
  uploadCarImage,
  removeCarImage,
  getCarById,
  findCarByFiltersAndByAvailabilityDays,
  getMyCars,
  updateCarRatingScoreAndAmount,
  checkIfCarExists,
  getCarsByOwnerId,
  disableCar,
  changeCarStatus,
  findAvailableCarsIds,
};
