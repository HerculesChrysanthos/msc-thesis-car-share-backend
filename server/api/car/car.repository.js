const Car = require('./car.model');

async function findCarByIdAndPopulateModelMake(carId) {
  return Car.findById(carId).populate('model make').lean().exec();
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

async function findCarByFiltersAndByAvailabilityDays(
  filters,
  differenceInHours
) {
  const pipeline = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(filters.long), parseFloat(filters.lat)],
        },
        distanceField: 'distance',
        maxDistance: 5000,
        spherical: true,
      },
    },
    {
      $lookup: {
        from: 'availabilities',
        localField: '_id',
        foreignField: 'car',
        as: 'availability',
      },
    },
    {
      $unwind: '$availability',
    },
    {
      $match: {
        'availability.date': {
          $gte: new Date(filters.startDate),
          $lt: new Date(filters.endDate),
        },
        'availability.status': 'AVAILABLE',
      },
    },
  ];

  pipeline.push(
    {
      $group: {
        _id: '$_id',
        car: { $first: '$$ROOT' },
        availabilities: { $addToSet: '$availability' },
      },
    },
    {
      $match: {
        availabilities: { $size: differenceInHours },
      },
    },
    {
      $replaceRoot: { newRoot: '$car' },
    },
    {
      $unset: ['availability'],
    },
    {
      $addFields: {
        price: {
          $multiply: ['$rentPerHour', differenceInHours],
        },
      },
    },
    {
      $lookup: {
        from: 'makes',
        localField: 'make',
        foreignField: '_id',
        as: 'make',
      },
    },
    { $unwind: '$make' },
    {
      $lookup: {
        from: 'models',
        localField: 'model',
        foreignField: '_id',
        as: 'model',
      },
    },
    { $unwind: '$model' },
    {
      $sort: {
        distance: 1,
      },
    },
    {
      $facet: {
        totalCount: [{ $count: 'count' }],
        paginatedResults: [{ $skip: filters.skip }, { $limit: filters.limit }],
      },
    }
  );

  return Car.aggregate(pipeline).exec();
}

async function getMyCars(userId) {
  return Car.find({ owner: userId }).populate('model make');
}

async function findCarByIdAndPopulateOnwer(id) {
  return Car.findById(id).populate('owner').lean().exec();
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
  findCarByFiltersAndByAvailabilityDays,
  getMyCars,
  findCarByIdAndPopulateOnwer,
};
