const ROLES = Object.freeze({
  OWNER: 'owner',
  RENTER: 'renter',
});

// TODO add more makes
const MAKES = Object.freeze({
  AUDI: 'audi',
});

const FUEL_TYPES = Object.freeze({
  PETROL: 'Βενζίνη',
  DIESEL: 'Πετρέλαιο',
  GAS: 'Αέριο',
});

const EMAIL_TYPES = Object.freeze({
  REGISTRATION: 'registration',
});

module.exports = {
  ROLES,
  MAKES,
  FUEL_TYPES,
  EMAIL_TYPES,
};
