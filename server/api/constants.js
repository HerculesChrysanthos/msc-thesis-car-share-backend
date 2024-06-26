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

const INTERIOR_COLORS = Object.freeze({
  WHITE: 'Άσπρο',
  GREY: 'Γκρι',
  TWO_COLOR: 'Δίχρωμο',
  BROWN: 'Καφέ',
  BLACK: 'Μαύρο',
  OTHER: 'Άλλο',
});

const EXTERIOR_COLORS = Object.freeze({
  WHITE: 'Άσπρο',
  BROWN: 'Καφέ',
  BLACK: 'Μαύρο',
  GREY: 'Γκρι',
  BLUE: 'Μπλε',
  YELLOW: 'Κίτρινο',
  RED: 'Κόκκινο',
  GREEN: 'Πράσινο',
  PINK: 'Ροζ',
  OTHER: 'Αλλο',
});

module.exports = {
  ROLES,
  FUEL_TYPES,
  EMAIL_TYPES,
  DRIVE_TYPES,
  GEARBOX_TYPES,
  FEATURES,
  INTERIOR_COLORS,
  EXTERIOR_COLORS,
};
