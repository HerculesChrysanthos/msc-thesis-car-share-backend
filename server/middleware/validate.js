const defaultMessages = {
  'string.base': 'Το πεδίο πρέπει να είναι κείμενο',
  'string.empty': 'Το πεδίο δεν πρέπει να είναι κενό',
  'string.min': 'Το πεδίο πρέπει να έχει τουλάχιστον {{#limit}} χαρακτήρες',
  'string.max': 'Το πεδίο πρέπει να έχει το πολύ {{#limit}} χαρακτήρες',
  'string.email': 'Το πεδίο πρέπει να είναι έγκυρη διεύθυνση email',
  'any.required': 'Το πεδίο είναι υποχρεωτικό',
  'number.base': 'Το πεδίο πρέπει να είναι αριθμός',
  'number.min': 'Το πεδίο πρέπει να είναι τουλάχιστον {{#limit}}',
  'number.max': 'Το πεδίο πρέπει να είναι το πολύ {{#limit}}',
  'object.unknown': 'Το πεδίο δεν επιτρέπεται',
};

const customPasswordMessages = {
  'passwordComplexity.tooShort':
    'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες',
  'passwordComplexity.tooLong':
    'Ο κωδικός πρέπει να έχει το πολύ 16 χαρακτήρες',
  'passwordComplexity.lowercase':
    'Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα πεζό γράμμα',
  'passwordComplexity.uppercase':
    'Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα κεφαλαίο γράμμα',
  'passwordComplexity.numeric':
    'Ο κωδικός πρέπει να περιέχει τουλάχιστον έναν αριθμό',
  'passwordComplexity.symbol':
    'Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα σύμβολο',
};

function translateErrors(error) {
  if (!error) return null;

  const errors = {};

  error.details.forEach((detail) => {
    const field = detail.context.label || detail.context.key; // const field = detail.context.key;
    const messageTemplate =
      defaultMessages[detail.type] || customPasswordMessages[detail.type];

    if (
      detail.type === 'any.only' &&
      detail.context.valids &&
      detail.context.valids.length > 0 &&
      detail.context.key !== 'passwordConfirmation'
    ) {
      const expectedValues = detail.context.valids.join(', '); // Get the expected values
      const customMessage = `Πρέπει να είναι μία από τις εξής τιμές: ${expectedValues}`;

      errors[field] = [customMessage];
      return;
    }

    let message = messageTemplate
      ? messageTemplate
          .replace(/{{#label}}/g, detail.context.label || detail.context.key)
          .replace(/{{#limit}}/g, detail.context.limit)
      : detail.message;

    if (!errors[field]) {
      errors[field] = [];
    }
    errors[field].push(message);
  });

  return errors;
}
const validator = (schema, property) => {
  return (req, res, next) => {
    const data = {};

    if (req.body && Object.keys(req.body).length > 0) {
      data.body = req.body;
    }

    if (req.query && Object.keys(req.query).length > 0) {
      data.query = req.query;
    }

    if (req.params && Object.keys(req.params).length > 0) {
      data.params = req.params;
    }

    if (req.files) {
      data.image = req.files.map((file) => file.buffer);
    }

    const { error } = schema.validate(data, { abortEarly: false });
    // console.log(`validator ${JSON.stringify(data)}`);

    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      const translatedErrors = translateErrors(error);

      console.log('error', translatedErrors);
      res.status(422).json({ error: translatedErrors });
    }
  };
};

module.exports = {
  validator,
};
