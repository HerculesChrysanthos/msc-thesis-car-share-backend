const modelService = require('./model.service');

async function getModelsByMake(req, res, next) {
  try {
    const models = await modelService.getModelsByMake(req.query.make);

    return res.status(200).json(models);
  } catch (error) {
    if (error.toString().includes('not found')) {
      error.status = 404;
    }

    return next(error);
  }
}

module.exports = {
  getModelsByMake,
};
