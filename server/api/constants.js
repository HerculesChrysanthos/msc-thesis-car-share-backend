const ROLES = Object.freeze({
  OWNER: 'owner',
  RENTER: 'renter',
  COMBINED: 'combined',
});

const FUEL_TYPES = Object.freeze({
  PETROL: 'Βενζίνη',
  DIESEL: 'Πετρέλαιο',
  GAS: 'Αέριο',
  ELECTRIC: 'Ηλεκτρικό',
});

const EMAIL_TYPES = Object.freeze({
  REGISTRATION: 'registration',
  REGISTRATION_GOOGLE: 'registration-google',
  VERIFIED: 'verified',
  VERIFICATION: 'verification',
});

const DRIVE_TYPES = Object.freeze({
  FWD: 'FWD',
  RWD: 'RWD',
  FOURXFOUR: '4x4',
  AWD: 'AWD',
});

const GEARBOX_TYPES = Object.freeze({
  AUTO: 'Αυτόματο',
  MANUAL: 'Μηχανικό',
  SEMIAUTO: 'Ημιαυτόματο',
});

const FEATURES = Object.freeze({
  AIR_CONDITION: 'air-condition',
});

module.exports = {
  ROLES,
  FUEL_TYPES,
  EMAIL_TYPES,
  DRIVE_TYPES,
  GEARBOX_TYPES,
  FEATURES,
};
