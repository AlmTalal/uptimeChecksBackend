const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = {
  userMail: { type: String, required: true },
  password: { type: String, required: true },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
