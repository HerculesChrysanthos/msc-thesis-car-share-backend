const cron = require('node-cron');
const bookingService = require('./api/booking/booking.service');

async function markBookingAsDone() {
  console.log('markBookingAsDone running ', new Date());
  const results =
    await bookingService.setAsDoneAcceptedBookingsThatEndDatePassed();
  console.log('markBookingAsDone finished ', new Date());
  console.log('marked as done ', results?.matchedCount);
}

// na koitazei bookings pou ksekinoun se 2 hmeres kai na kanei auto reject

// elegxo an uparxei kapoia se mia wra mprosta

function scheduleJobs() {
  // '* * * * *' run every minute
  // '1 * * * *' Schedule the job to run at the first minute of every hour
  cron.schedule('* * * * *', markBookingAsDone);
}

module.exports = scheduleJobs;
