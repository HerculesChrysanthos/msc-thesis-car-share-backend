const { query } = require('express');
const Joi = require('joi');

const getModelsByMakeSchema = Joi.object({
  query: Joi.object({
    make: Joi.string().required(),
  }).required(),
});

module.exports = {
  getModelsByMakeSchema,
};
