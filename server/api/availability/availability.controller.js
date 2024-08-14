const availabilityService = require('./availability.service');

async function createAvailability(req, res, next) {
  try {
    const availability = req.body;
    const carId = req.car._id;

    const availabilities = await availabilityService.createAvailability(
      availability,
      carId
    );
    return res.status(201).json(availabilities);
  } catch (error) {
    console.log(`error: ${error}`);

    if (error.toString().includes('duplicate key')) {
      error.message = error?.writeErrors[0]?.err?.op?.date
        ? `Το timeslot ${error?.writeErrors[0]?.err?.op?.date} υπάρχει ήδη.`
        : 'Το timeslot υπάρχει ήδη';

      error.status = 409;
    }

    if (
      error
        .toString()
        .includes(
          'Δεν μπορείς να προσθέσεις επιπλέον διαθεσιμότητα. Επεξεργάσου την υπάρχουσα.'
        )
    ) {
      error.status = 409;
    }

    return next(error);
  }
}

async function findCarAvailabilities(req, res, next) {
  try {
    const car = req.params.carId;

    const availabilities = await availabilityService.findCarAvailabilities(car);

    return res.status(200).json(availabilities);
  } catch (error) {
    return next(error);
  }
}

async function updateCarAvailabilities(req, res, next) {
  try {
    const availability = req.body;
    const carId = req.car._id;

    await availabilityService.updateCarAvailabilities(availability, carId);
    return res.status(200).json({});
  } catch (error) {
    if (
      error
        .toString()
        .includes(
          'Δεν μπορούμε να προχωρήσουμε στην αλλαγή της διαθεσιμότητας, καθώς στην αρχική διαθεσιμότητα υπάρχουν κρατήσεις.'
        )
    ) {
      error.status = 409;
    }

    return next(error);
  }
}

module.exports = {
  createAvailability,
  findCarAvailabilities,
  updateCarAvailabilities,
};
