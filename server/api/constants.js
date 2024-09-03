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
  BOOKING_OWNER: 'booking-owner',
  BOOKING_RENTER: 'booking-renter',
  BOOKING_ACCEPTANCE: 'booking-acceptance',
  BOOKING_REJECTION: 'booking-rejection',
  BOOKING_CANCELEATION_BY_OWNER: 'booking-cancelation-by-owner',
  BOOKING_CANCELEATION_BY_RENTER: 'booking-cancelation-by-renter',
  REVIEW_PROMP_ONWER: 'review-promp-onwer',
  REVIEW_PROMP_RENTER: 'review-promp-renter',
});

const GEARBOX_TYPES = Object.freeze({
  AUTO: 'Αυτόματο',
  MANUAL: 'Μηχανικό',
  SEMIAUTO: 'Ημιαυτόματο',
});

const FEATURES = Object.freeze({
  AIR_CONDITION: 'Air condition',
  ABS: 'ABS',
  BLUETOOTH: 'Bluetooth',
  ESP: 'ESP',
  REAR_VIEW_CAMERA: 'Κάμερα οπισθοπορείας',
  GPS: 'GPS',
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
  OTHER: 'Άλλο',
});

module.exports = {
  ROLES,
  FUEL_TYPES,
  EMAIL_TYPES,
  GEARBOX_TYPES,
  FEATURES,
  INTERIOR_COLORS,
  EXTERIOR_COLORS,
};
