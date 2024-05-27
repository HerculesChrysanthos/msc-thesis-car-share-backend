const makeService = require('./make.service');

async function getAllMakes(req, res, next) {
  try {
    const makes = await makeService.getAllMakes();

    return res.status(200).json(makes);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllMakes,
};
