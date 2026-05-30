const Joi = require('joi');

const createSquadSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  campaign_id: Joi.number().integer().positive().required(),
  target_amount: Joi.number().integer().min(10000).optional(),
});

module.exports = { createSquadSchema };
