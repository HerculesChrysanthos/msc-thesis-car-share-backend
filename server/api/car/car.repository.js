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

module.exports = {
  createCar,
  findCarById,
  updateCarById,
  uploadCarImage,
  addThumbnail,
};
