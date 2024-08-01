const mongoose = require('mongoose');
const Availability = require('./availability.model');

async function insertMultipleAvailabilities(availabilities) {
  return Availability.insertMany(availabilities);
}

async function findAvailabilityByDay({ date, car }) {
  return Availability.findOne({ date, car }).lean().exec();
}

async function findCarAvailabilityOnSpecificDays(car, filters) {
  const startDate = filters.startDate;
  const endDate = filters.endDate;
  const startHour = filters.startHour;
  const endHour = filters.endHour;

  const pipeline = [
    {
      $match: {
        car: new mongoose.Types.ObjectId(car),
        date: {
          $gte: new Date(startDate.format('YYYY-MM-DD')),
          $lte: new Date(endDate.format('YYYY-MM-DD')),
        },
      },
    },
  ];

  if (startDate.isSame(endDate, 'day')) {
    pipeline.push({
      $project: {
        date: 1,
        hours: {
          $filter: {
            input: '$hours',
            as: 'hour',
            cond: {
              $and: [
                {
                  $eq: ['$date', new Date(startDate.format('YYYY-MM-DD'))],
                },
                {
                  $eq: ['$date', new Date(endDate.format('YYYY-MM-DD'))],
                },
                {
                  $eq: ['$$hour.status', 'available'],
                },
                {
                  $gte: ['$$hour.hour', startHour],
                },
                {
                  $lt: ['$$hour.hour', 24 - endHour],
                },
              ],
            },
          },
        },
      },
    });
  } else {
    pipeline.push({
      $project: {
        date: 1,
        hours: {
          $filter: {
            input: '$hours',
            as: 'hour',
            cond: {
              $or: [
                {
                  $and: [
                    {
                      $eq: ['$date', new Date(startDate.format('YYYY-MM-DD'))],
                    },
                    {
                      $eq: ['$$hour.status', 'available'],
                    },
                    {
                      $gte: ['$$hour.hour', startHour],
                    },
                  ],
                },
                {
                  $and: [
                    {
                      $eq: ['$date', new Date(endDate.format('YYYY-MM-DD'))],
                    },
                    {
                      $eq: ['$$hour.status', 'available'],
                    },
                    {
                      $lt: ['$$hour.hour', 24 - endHour],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    });
  }

  pipeline.push(
    {
      $unwind: '$hours',
    },
    {
      $group: {
        _id: null,
        hoursTotal: { $sum: 1 },
        hours: { $push: '$hours' },
      },
    }
  );

  return Availability.aggregate(pipeline).exec();
}

module.exports = {
  insertMultipleAvailabilities,
  findAvailabilityByDay,
  findCarAvailabilityOnSpecificDays,
};
