const availabilityService = require('./availability.service');

async function findCarAvailabilitiesByStatus(req, res, next) {
  try {
    const car = req.params.carId;
    const status = req.query.status;

    const availabilities =
      await availabilityService.findCarAvailabilitiesByStatus(car, status);

    const results = availabilities[0]?.segments || [];

    return res.status(200).json(results);
  } catch (error) {
    return next(error);
  }
}

async function updateCarAvailabilities(req, res, next) {
  try {
    const availability = req.body;
    const carId = req.car._id;

    if (!availability.status) {
      await availabilityService.updateCarAvailabilities(availability, carId);
    } else {
      await availabilityService.updatePartialCarAvailabilities(
        carId,
        availability
      );
    }

    return res.status(200).json({});
  } catch (error) {
    if (
      error
        .toString()
        .includes(
          'Δεν μπορούμε να προχωρήσουμε στην αλλαγή της διαθεσιμότητας, καθώς στην αρχική διαθεσιμότητα υπάρχουν κρατήσεις.'
        ) ||
      error
        .toString()
        .includes(
          'Δεν μπορείς να αλλάξεις διάστημα διαθεσιμότητας που δεν υπάρχει ή περιέχει κράτηση.'
        )
    ) {
      error.status = 409;
    }

    return next(error);
  }
}

module.exports = {
  findCarAvailabilitiesByStatus,
  updateCarAvailabilities,
};
