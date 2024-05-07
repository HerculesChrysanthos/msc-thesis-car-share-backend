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

    const { error } = schema.validate(data);
    console.log(`validator ${JSON.stringify(data)}`);

    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');

      console.log('error', message);
      res.status(422).json({ error: message });
    }
  };
};

module.exports = {
  validator,
};
