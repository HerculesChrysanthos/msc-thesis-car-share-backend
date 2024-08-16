const mongoose = require('mongoose');
const Availability = require('./availability.model');

async function insertMultipleAvailabilities(availabilities, session) {
  return Availability.insertMany(availabilities, { session });
}

async function setBookingOnAvailabilities(booking, availabilities) {
  return Availability.updateMany(
    { _id: { $in: availabilities } },
    { $set: { booking } }
  );
}

async function findCarAvailabilitiesGroupByDay(car, dates) {
  return Availability.aggregate([
    {
      $match: {
        car: new mongoose.Types.ObjectId(car),
      },
    },
    {
      $project: {
        dateOnly: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$date',
          },
        },
        hour: {
          $hour: {
            date: '$date',
          },
        },
        status: 1,
        booking: 1,
      },
    },
    {
      $group: {
        _id: '$dateOnly',
        hours: {
          $push: {
            _id: '$_id',
            hour: '$hour',
            status: '$status',
            booking: '$booking',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        hours: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ]).exec();
}

async function findCarAvailabilities(car) {
  return Availability.aggregate([
    {
      $match: {
        car: new mongoose.Types.ObjectId(car),
      },
    },
    {
      $group: {
        _id: { status: '$status' },
        dates: { $push: '$date' },
        //  booking: { $first: '$booking' },
      },
    },
    {
      $project: {
        _id: 0,
        status: '$_id.status',
        // booking: 1,
        segments: {
          $let: {
            vars: {
              reduced: {
                $reduce: {
                  input: '$dates',
                  initialValue: {
                    lastDate: null,
                    currentSegment: [],
                    segments: [],
                  },
                  in: {
                    $cond: {
                      if: {
                        $or: [
                          { $eq: ['$$value.lastDate', null] },
                          {
                            $lte: [
                              { $subtract: ['$$this', '$$value.lastDate'] },
                              3600000, // 1 hour in milliseconds
                            ],
                          },
                        ],
                      },
                      then: {
                        lastDate: '$$this',
                        currentSegment: {
                          $concatArrays: ['$$value.currentSegment', ['$$this']],
                        },
                        segments: '$$value.segments',
                      },
                      else: {
                        lastDate: '$$this',
                        currentSegment: ['$$this'],
                        segments: {
                          $concatArrays: [
                            '$$value.segments',
                            ['$$value.currentSegment'],
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
            in: {
              $concatArrays: [
                '$$reduced.segments',
                ['$$reduced.currentSegment'],
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        status: 1,
        // booking: 1,
        segments: {
          $map: {
            input: '$segments',
            as: 'seg',
            in: {
              startDate: { $arrayElemAt: ['$$seg', 0] },
              endDate: { $arrayElemAt: ['$$seg', -1] },
            },
          },
        },
      },
    },
  ]).exec();
}

async function findCarAvailabilitiesOnSpecificDates(car, filters, session) {
  const startDate = filters.startDate;
  const endDate = filters.endDate;

  const status = filters.searchStatus || 'AVAILABLE';

  const query = {
    car: new mongoose.Types.ObjectId(car),
    date: {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    },
    status,
  };

  return Availability.find(query, { _id: 1 }).session(session).lean().exec();
}

async function changeAvailabilitiesStatus(availabilities, status, session) {
  return Availability.updateMany(
    {
      _id: { $in: availabilities },
    },
    {
      $set: { status },
    },
    { session }
  );
}

async function findAvailabilitiesByCarId(car, session) {
  return Availability.find({ car }).session(session).lean().exec();
}

async function deleteAvailabilities(availabilities, session) {
  return Availability.deleteMany({ _id: { $in: availabilities } }).session(
    session
  );
}

async function findCarAvailableOrReservedAvailabilities(car) {
  return Availability.find({ car, status: { $in: ['AVAILABLE', 'RESERVED'] } });
}

module.exports = {
  insertMultipleAvailabilities,
  findCarAvailabilitiesGroupByDay,
  findCarAvailabilitiesOnSpecificDates,
  findCarAvailabilities,
  changeAvailabilitiesStatus,
  setBookingOnAvailabilities,
  findAvailabilitiesByCarId,
  deleteAvailabilities,
  findCarAvailableOrReservedAvailabilities,
};
