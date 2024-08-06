const cron = require('node-cron');
const bookingService = require('./api/booking/booking.service');

async function markBookingAsDone() {
  console.log('markBookingAsDone running ', new Date());
  const results =
    await bookingService.setAsDoneAcceptedBookingsThatEndDatePassed();
  console.log('markBookingAsDone finished ', new Date());
  console.log(results);
}

function scheduleJobs() {
  cron.schedule('* * * * *', markBookingAsDone);
}

module.exports = scheduleJobs;
