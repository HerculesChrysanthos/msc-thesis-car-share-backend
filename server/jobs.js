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
  await availabilityService.extendCarsAvailabilitiesByOneDay(nowUtc, carIds);

  console.log('extendCarsAvailabilities finished ', new Date());
}

function scheduleJobs() {
  // '* * * * *' run every minute
  // '1 * * * *' Schedule the job to run at the first minute of every hour
  cron.schedule('1 * * * *', markBookingAsDone);
  // 0 2 * * * every day at 2 am
  cron.schedule('0 2 * * *', extendCarsAvailabilities);
}

module.exports = scheduleJobs;
