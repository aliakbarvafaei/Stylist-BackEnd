// Exclude keys from user
exports.exclude = (user, keys) => {
  for (let key of keys) {
    delete user[key];
  }
  return user;
};
