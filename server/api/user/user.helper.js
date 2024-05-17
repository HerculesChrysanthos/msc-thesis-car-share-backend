function buildUserResponse(user) {
  return {
    user: {
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      vat: user.vat,
      licence: user.licence,
      drivingSince: user.drivingSince,
      profilePictureUrl: user.profilePictureUrl,
      googleId: user.googleId,
      verified: user.verified,
    },
    token: user.token,
  };
}

module.exports = {
  buildUserResponse,
};
