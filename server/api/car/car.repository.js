const Car = require('./car.model');
const mongoose = require('mongoose');

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
  ];

  if (filters.maxPrice && filters.minPrice) {
    pipeline.push({
      $match: {
        rentPerHour: {
          $lte: Number(filters.maxPrice),
          $gte: Number(filters.minPrice),
        },
      },
    });
  }

  if (filters.make) {
    pipeline.push({
      $match: {
        make: new mongoose.Types.ObjectId(filters.make),
      },
    });
  }

  if (filters.model) {
    pipeline.push({
      $match: {
        model: new mongoose.Types.ObjectId(filters.model),
      },
    });
  }

  if (filters.gearboxType) {
    pipeline.push({
      $match: {
        gearboxType: filters.gearboxType,
      },
    });
  }

  pipeline.push(
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
    }
  );

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
        general: [
          {
            $group: {
              _id: null,
              minPrice: { $min: '$rentPerHour' },
              maxPrice: { $max: '$rentPerHour' },
              makes: { $addToSet: '$make' },
              models: { $addToSet: '$model' },
            },
          },
          {
            $project: {
              _id: 0,
              minPrice: 1,
              maxPrice: 1,
              makes: 1,
              models: 1,
            },
          },
        ],
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

async function updateCarRatingScoreAndAmount(id, score, amount) {
  return Car.findByIdAndUpdate(
    id,
    {
      $set: {
        ratingsScore: score,
        ratingsAmount: amount,
      },
    },
    { new: true }
  );
}

async function getCarsByOwnerId(ownerId, skip, limit) {
  return Car.aggregate([
    {
      $match: {
        owner: ownerId,
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
        _id: -1,
      },
    },
    {
      $facet: {
        totalCount: [{ $count: 'count' }],
        paginatedResults: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]).exec();
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
  updateCarRatingScoreAndAmount,
  getCarsByOwnerId,
};
