const Car = require('./car.model');

async function findCarByIdAndPopulateModelMake(carId) {
  return Car.findById(carId).populate('model make').exec();
}

async function createCar(car) {
  return Car.create(car);
}

async function findCarById(id) {
  return Car.findById(id).lean().exec();
}

async function updateCarById(id, updates) {
  return Car.findByIdAndUpdate(id, { $set: updates }, { new: true })
    .populate('model make')
    .lean()
    .exec();
}

async function uploadCarImage(id, imageUrl, externalId) {
  return Car.findByIdAndUpdate(
    id,
    {
      $addToSet: { images: { url: imageUrl, externalId } },
    },
    { new: true }
  )
    .lean()
    .exec();
}

async function addThumbnail(id, imageUrl, addedImagedId, externalId) {
  return Car.findByIdAndUpdate(
    id,
    {
      $set: {
        thumbnail: { url: imageUrl, imageId: addedImagedId, externalId },
      },
    },
    { new: true }
  )
    .lean()
    .exec();
}

async function removeCarImage(id, imageId) {
  return Car.findByIdAndUpdate(
    id,
    { $pull: { images: { _id: imageId } } },
    { new: true }
  )
    .lean()
    .exec();
}

async function removeCarThumbnail(id) {
  return Car.findByIdAndUpdate(id, { $unset: { thumbnail: '' } }, { new: true })
    .lean()
    .exec();
}

module.exports = {
  createCar,
  findCarByIdAndPopulateModelMake,
  findCarById,
  updateCarById,
  uploadCarImage,
  addThumbnail,
  removeCarImage,
  removeCarThumbnail,
};
