const Car = require('./car.model');

async function createCar(car) {
  return Car.create(car);
}

async function findCarById(id) {
  return Car.findById(id).lean().exec();
}

async function updateCarById(id, updates) {
  return Car.findByIdAndUpdate(id, { $set: updates }, { new: true })
    .lean()
    .exec();
}

async function uploadCarImage(id, imageUrl) {
  return Car.findByIdAndUpdate(
    id,
    {
      $addToSet: { images: { url: imageUrl } },
    },
    { new: true }
  )
    .lean()
    .exec();
}

async function addThumbnail(id, imageUrl, addedImagedId) {
  return Car.findByIdAndUpdate(
    id,
    {
      $set: { thumbnail: { url: imageUrl, imageId: addedImagedId } },
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
  findCarById,
  updateCarById,
  uploadCarImage,
  addThumbnail,
  removeCarImage,
  removeCarThumbnail,
};
