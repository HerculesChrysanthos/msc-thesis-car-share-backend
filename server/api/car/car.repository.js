const Car = require('./car.model');
const moment = require('moment');

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

async function findCarByFiltersAndByAvailabilityDays(filters) {
  const startDate = moment.utc(filters.startDate);
  const endDate = moment.utc(filters.endDate);

  const midnightOfStartDate = startDate.clone().startOf('day');
  const hoursBeforeStartDate = startDate.diff(midnightOfStartDate, 'hours');

  const midnightAfterEndDate = endDate.clone().add(1, 'day').startOf('day');
  const hoursAfterEndEndDate = Math.abs(
    endDate.diff(midnightAfterEndDate, 'hours')
  );
  const differenceInHours = endDate.diff(startDate, 'hours');

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
          $gte: new Date(startDate.format('YYYY-MM-DD')),
          $lte: new Date(endDate.format('YYYY-MM-DD')),
        },
      },
    },
    {
      $unwind: '$availability.hours',
    },
  ];

  if (startDate.isSame(endDate, 'day')) {
    pipeline.push({
      $match: {
        'availability.date': {
          $eq: new Date(startDate.format('YYYY-MM-DD')),
          $eq: new Date(endDate.format('YYYY-MM-DD')),
        },
        'availability.hours.hour': {
          $gte: hoursBeforeStartDate,
          $lt: 24 - hoursAfterEndEndDate,
        },
        'availability.hours.status': 'available',
      },
    });
  } else {
    pipeline.push({
      $match: {
        $or: [
          {
            'availability.date': new Date(startDate.format('YYYY-MM-DD')),
            'availability.hours.hour': { $gte: hoursBeforeStartDate },
            'availability.hours.status': 'available',
          },
          {
            'availability.date': new Date(endDate.format('YYYY-MM-DD')),
            'availability.hours.hour': { $lt: 24 - hoursAfterEndEndDate },
            'availability.hours.status': 'available',
          },
          {
            'availability.date': {
              $gt: new Date(startDate.format('YYYY-MM-DD')),
              $lt: new Date(endDate.format('YYYY-MM-DD')),
            },
            'availability.hours.status': 'available',
          },
        ],
      },
    });
  }

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
};
