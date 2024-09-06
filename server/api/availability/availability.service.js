const mongoose = require('mongoose');
const availabilityRepository = require('./availability.repository');
const moment = require('moment');

async function createAvailability(availability, carId) {
  const existingAvailabilities =
    await availabilityRepository.findCarAvailableOrReservedAvailabilities(
      carId
    );
  if (existingAvailabilities.length > 0) {
    throw new Error(
      'Δεν μπορείς να προσθέσεις επιπλέον διαθεσιμότητα. Επεξεργάσου την υπάρχουσα.'
    );
  }

  const startDate = moment.utc(availability.startDate);
  const endDate = moment.utc(availability.endDate);

  const availabilities = [];
  let createdAvailabilities;

  const currentDate = startDate.clone();

  while (currentDate.isBefore(endDate)) {
    availabilities.push({
      car: carId,
      date: currentDate.toISOString(),
      status: 'AVAILABLE',
    });

    currentDate.add(1, 'hour');
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check if car has availabilities, if yes throw error
    createdAvailabilities =
      await availabilityRepository.insertMultipleAvailabilities(
        availabilities,
        session
      );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return createdAvailabilities;
}

async function findCarAvailabilitiesOnSpecificDates(
  car,
  startDate,
  endDate,
  session
) {
  const start = moment.utc(startDate);
  const end = moment.utc(endDate);
  const differenceInHours = end.diff(start, 'hours');

  const filters = {
    startDate: start,
    endDate: end,
  };
  const carAvailabilities =
    await availabilityRepository.findCarAvailabilitiesOnSpecificDates(
      car,
      filters,
      session
    );

  if (carAvailabilities.length !== differenceInHours) {
    throw new Error('Το αυτοκίνητο δεν είναι διαθέσιμο τις επιλεγμένες ώρες.'); // 404
  }

  return carAvailabilities;
}

async function changeAvailabilitiesStatus(availabilities, status, session) {
  return availabilityRepository.changeAvailabilitiesStatus(
    availabilities,
    status,
    session
  );
}

async function findCarAvailabilitiesGroupByDay(car, dates) {
  return availabilityRepository.findCarAvailabilitiesGroupByDay(car, dates);
}

async function findCarAvailabilitiesByStatus(car, status) {
  return availabilityRepository.findCarAvailabilitiesByStatus(car, status);
}

async function setBookingOnAvailabilities(booking, availabilities) {
  return availabilityRepository.setBookingOnAvailabilities(
    booking,
    availabilities
  );
}

async function updateCarAvailabilities(incomingAvailability, carId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingCarAvailabilities =
      await availabilityRepository.findAvailabilitiesByCarId(carId, session);

    const startDate = moment.utc(incomingAvailability.startDate);
    const endDate = moment.utc(incomingAvailability.endDate);

    const availabilities = [];

    const currentDate = startDate.clone();

    while (currentDate.isBefore(endDate)) {
      availabilities.push({
        car: carId,
        date: currentDate.toISOString(),
        status: 'AVAILABLE',
      });

      currentDate.add(1, 'hour');
    }

    const incomingAvailabilitiesSet = new Set(
      availabilities.map((availability) =>
        new Date(availability.date).toISOString()
      )
    );

    const missingBookings = existingCarAvailabilities.filter(
      (availability) =>
        availability.booking &&
        !incomingAvailabilitiesSet.has(
          new Date(availability.date).toISOString()
        )
    );

    if (missingBookings.length > 0) {
      throw new Error(
        'Δεν μπορούμε να προχωρήσουμε στην αλλαγή της διαθεσιμότητας, καθώς στην αρχική διαθεσιμότητα υπάρχουν κρατήσεις.'
      );
    }

    const existingAvailabilitiesSet = new Set(
      existingCarAvailabilities.map((availability) =>
        availability.date.toISOString()
      )
    );

    const availabilitiesToAdd = availabilities.filter(
      (availability) =>
        !existingAvailabilitiesSet.has(
          new Date(availability.date).toISOString()
        )
    );

    await availabilityRepository.insertMultipleAvailabilities(
      availabilitiesToAdd,
      session
    );

    const availabilitiesToRemove = existingCarAvailabilities
      .filter(
        (availability) =>
          !incomingAvailabilitiesSet.has(availability.date.toISOString()) &&
          !availability.bookingId
      )
      .map((availability) => availability._id);

    await availabilityRepository.deleteAvailabilities(
      availabilitiesToRemove,
      session
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function findCarAvailableOrReservedAvailabilities(car) {
  return availabilityRepository.findCarAvailableOrReservedAvailabilities(car);
}

async function updatePartialCarAvailabilities(carId, availability) {
  const session = await mongoose.startSession();
  session.startTransaction();

  const startDate = moment.utc(availability.startDate);
  const endDate = moment.utc(availability.endDate);
  const searchStatus =
    availability.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
  const status = availability.status;

  const availabilities = [];

  const currentDate = startDate.clone();

  while (currentDate.isBefore(endDate)) {
    availabilities.push({
      car: carId,
      date: currentDate.toISOString(),
      status: 'AVAILABLE',
    });

    currentDate.add(1, 'hour');
  }

  const filters = {
    startDate,
    endDate,
    searchStatus,
  };

  try {
    const existingAvailabilities =
      await availabilityRepository.findCarAvailabilitiesOnSpecificDates(
        carId,
        filters,
        session
      );

    if (existingAvailabilities.length !== availabilities.length) {
      throw new Error(
        'Δεν μπορείς να αλλάξεις διάστημα διαθεσιμότητας που δεν είναι διαθέσιμες ή περιέχει κράτηση.'
      );
    }

    await availabilityRepository.changeAvailabilitiesStatus(
      existingAvailabilities,
      status,
      session
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function setAvailabilitiesAsAvailableByBookingId(bookingId) {
  return availabilityRepository.setAvailabilitiesAsAvailableByBookingId(
    bookingId
  );
}

async function deleteAvailabilitiesByCarId(id, session) {
  return availabilityRepository.deleteAvailabilitiesByCarId(id, session);
}

async function createAvailabilities(carId) {
  const nowUtc = new Date();
  nowUtc.setUTCMinutes(0, 0, 0);

  const futureUtc = new Date(nowUtc);
  futureUtc.setUTCDate(nowUtc.getUTCDate() + 60);

  const availability = {
    startDate: nowUtc,
    endDate: futureUtc,
  };

  const startDate = moment.utc(availability.startDate);
  const endDate = moment.utc(availability.endDate);

  const availabilities = [];

  const currentDate = startDate.clone();

  while (currentDate.isBefore(endDate)) {
    availabilities.push({
      car: carId,
      date: currentDate.toISOString(),
      status: 'AVAILABLE',
    });

    currentDate.add(1, 'hour');
  }

  const existingReservedAvailabilities =
    await availabilityRepository.findCarReservedAvailabilities(carId);

  const existingReservedAvailabilitiesSet = new Set(
    existingReservedAvailabilities.map((availability) =>
      availability.date.toISOString()
    )
  );

  const availabilitiesToAdd = availabilities.filter(
    (availability) =>
      !existingReservedAvailabilitiesSet.has(
        new Date(availability.date).toISOString()
      )
  );

  await availabilityRepository.insertMultipleAvailabilities(
    availabilitiesToAdd
  );
}

async function deleteCarAvailableAvailabilities(carId) {
  return availabilityRepository.deleteCarAvailableAvailabilities(carId);
}

module.exports = {
  createAvailability,
  findCarAvailabilitiesOnSpecificDates,
  changeAvailabilitiesStatus,
  findCarAvailabilitiesGroupByDay,
  findCarAvailabilitiesByStatus,
  setBookingOnAvailabilities,
  updateCarAvailabilities,
  findCarAvailableOrReservedAvailabilities,
  updatePartialCarAvailabilities,
  setAvailabilitiesAsAvailableByBookingId,
  deleteAvailabilitiesByCarId,
  createAvailabilities,
  deleteCarAvailableAvailabilities,
};
