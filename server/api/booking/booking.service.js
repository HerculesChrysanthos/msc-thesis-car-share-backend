const availabilityService = require('../availability/availability.service');

async function createBooking(car, startDate, endDate) {
  const availabilities =
    await availabilityService.findCarAvailabilitiesOnSpecificDates(
      car,
      startDate,
      endDate
    );

  // set availabilities RESERVED

  // create booking

  // update availabilities the bookingid
  // payment?

  // send emails
}

module.exports = {
  createBooking,
};
