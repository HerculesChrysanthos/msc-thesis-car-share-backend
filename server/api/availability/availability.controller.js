const availabilityService = require('./availability.service');

async function createAvailability(req, res, next) {
  try {
    const availability = req.body;
    const carId = req.car._id;

    await availabilityService.createAvailability(availability, carId);
    return res.status(201).json();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createAvailability,
};
