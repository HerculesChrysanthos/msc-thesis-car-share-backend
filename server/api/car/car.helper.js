function prepareImageName(name, user) {
  return `${Date.now()}${user}-1${name}`;
}

module.exports = {
  prepareImageName,
};
