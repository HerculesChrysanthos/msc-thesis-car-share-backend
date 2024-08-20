function buildUserResponse(user) {
  return {
    user: {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      vat: user.vat,
      licenceNumber: user.licenceNumber,
      drivingSince: user.drivingSince,
      profileImage: user.profileImage,
      googleId: user.googleId,
      verified: user.verified,
      ratingsScore: user.ratingsScore,
      ratingsAmount: user.ratingsAmount,
    },
    token: user.token,
  };
}

module.exports = {
  buildUserResponse,
};
