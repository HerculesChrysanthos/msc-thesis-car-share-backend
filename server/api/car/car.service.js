const carRepository = require('./car.repository');
const modelService = require('../model/model.service');
const makeservice = require('../make/make.service');
const utils = require('../../utils');
const carHelper = require('./car.helper');
const sharpHelper = require('../../helpers/sharp.helper');
const imagekitClient = require('../../clients/imagekit-client');

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

    // TODO download image
    const image = await imagekitClient.getImage(existingCarImage.url);

    const resizedThumbnail = await sharpHelper.resizeImage(image.buffer, {
      width: 200,
      //height: 400,
    });

    const resizedName = `${Date.now()}${existingCarImage._id}_thumbnail`;

    await imagekitClient.uploadImage(resizedThumbnail, resizedName);

    const thumbnailUrl = `https://ik.imagekit.io/carsharerentingapp/${resizedName}`;

    car.thumbnail = {
      url: thumbnailUrl,
      imageId: car.thumbnail,
    };
  }

  return carRepository.updateCarById(carId, car);
}

async function uploadCarImage(carId, image, user, setImageAsThumbnail) {
  image.originalname = image.originalname.replace(/[^a-zA-Z0-9.]/g, '_');

  const name = carHelper.prepareImageName(image.originalname, user);

  const resizedImage = await sharpHelper.resizeImage(image.buffer, {
    width: 400,
    //height: 400,
  });

  await imagekitClient.uploadImage(resizedImage, name);

  const imageUrl = `https://ik.imagekit.io/carsharerentingapp/${name}`;

  const updatedCar = await carRepository.uploadCarImage(carId, imageUrl);

  if (setImageAsThumbnail) {
    const addedImagedId = updatedCar.images?.find(
      (image) => image.url === imageUrl
    );

    const resizedThumbnail = await sharpHelper.resizeImage(image.buffer, {
      width: 200,
      //height: 400,
    });

    const resizedName = `${name}_thumbnail`;

    await imagekitClient.uploadImage(resizedThumbnail, resizedName);

    const thumbnailUrl = `https://ik.imagekit.io/carsharerentingapp/${resizedName}`;

    return carRepository.addThumbnail(
      carId,
      thumbnailUrl,
      addedImagedId._id.toString()
    );
  }

  return updatedCar;
}

module.exports = {
  createCar,
  updateCarSpecificFields,
  uploadCarImage,
};
