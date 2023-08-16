const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: require("find-config")("./.env") });

const userSchema = new mongoose.Schema({
  userMail: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ userMail: this.userMail }, process.env.JWTPRIVATEKEY);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
