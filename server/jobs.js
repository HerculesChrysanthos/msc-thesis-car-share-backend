const cron = require('node-cron');
const bookingService = require('./api/booking/booking.service');
const carService = require('./api/car/car.service');
const availabilityService = require('./api/availability/availability.service');

async function markBookingAsDone() {
  console.log('markBookingAsDone running ', new Date());
  const results =
    await bookingService.setAsDoneAcceptedBookingsThatEndDatePassed();
  console.log('markBookingAsDone finished ', new Date());
  console.log('marked as done ', results?.matchedCount);
}

async function extendCarsAvailabilities() {
  console.log('extendCarsAvailabilities running ', new Date());
  const carIds = await carService.findAvailableCarsIds();

  const nowUtc = new Date();
  nowUtc.setUTCMinutes(0, 0, 0);
  nowUtc.setUTCHours(0, 0, 0, 0);

  await availabilityService.deleteBeforeGivenDateAvailabilitiesByCarIds(
    nowUtc,
    carIds
  );

  // const start = new Date(nowUtc);
  // start.setUTCDate(nowUtc.getUTCDate() + 60);

  // start.setUTCHours(0, 0, 0, 0);

  // const end = new Date(nowUtc);
  // end.setUTCDate(nowUtc.getUTCDate() + 61);

  // end.setUTCHours(0, 0, 0, 0);

  // const availability = {
  //   startDate: start,
  //   endDate: end,
  // };

  // const startDate = moment.utc(availability.startDate);
  // const endDate = moment.utc(availability.endDate);

  // const availabilities = [];

  // const currentDate = startDate.clone();

  // while (currentDate.isBefore(endDate)) {
  //   availabilities.push({
  //     car: carId.toString(),
  //     date: currentDate.toISOString(),
  //     status: 'AVAILABLE',
  //   });

  //   currentDate.add(1, 'hour');
  // }

  console.log('extendCarsAvailabilities finished ', new Date());
}

// na koitazei bookings pou ksekinoun se 2 hmeres kai na kanei auto reject

// elegxo an uparxei kapoia se mia wra mprosta

function scheduleJobs() {
  // '* * * * *' run every minute
  // '1 * * * *' Schedule the job to run at the first minute of every hour
  cron.schedule('* * * * *', markBookingAsDone);

  // cron.schedule('* * * * *', extendCarsAvailabilities);
}

module.exports = scheduleJobs;
