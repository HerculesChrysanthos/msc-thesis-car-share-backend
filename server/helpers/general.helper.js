function prepareImageName(name, user) {
  return `${name}-${Date.now()}${user}`;
}

module.exports = {
  prepareImageName,
};
