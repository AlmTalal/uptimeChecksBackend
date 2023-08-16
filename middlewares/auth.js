const jwt = require("jsonwebtoken");

module.exports = (token) => {
  const user = jwt.decode(token);
  if (user.userMail) return true;
  return false;
};
