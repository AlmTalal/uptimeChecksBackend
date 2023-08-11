const Joi = require("joi");
const mongoose = require("mongoose");

const uptimeCheckSchema = {
  checkedId: String,
  checkedUrl: String,
  name: String,
  checkedStatus: String,
};

const UptimeCheck = mongoose.model("Uptime Check", uptimeCheckSchema);

function validateUptimeCheck(uptimeCheck) {
  const schema = Joi.object({
    checkedId: Joi.string().required(),
    checkedUrl: Joi.string(),
    name: Joi.string().required().min(3),
    checkedStatus: Joi.number(),
  });

  const { error } = schema.validate(uptimeCheck);

  if (!error) return;
  return error;
}

exports.validateUptimeCheck = validateUptimeCheck;
exports.UptimeCheck = UptimeCheck;
