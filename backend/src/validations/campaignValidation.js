const Joi = require('joi');

const submitCampaignSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  category_id: Joi.number().integer().positive().required(),
  short_description: Joi.string().max(500).allow('', null).optional(),
  description: Joi.string().max(10000).allow('', null).optional(),
  target_amount: Joi.number().integer().min(100000).required(),
  banner_image: Joi.string().uri().max(500).allow('', null).optional(),
  deadline: Joi.date().iso().min('now').allow(null).optional(),
});

const updateMyCampaignSchema = Joi.object({
  title: Joi.string().min(5).max(255).optional(),
  category_id: Joi.number().integer().positive().optional(),
  short_description: Joi.string().max(500).allow('', null).optional(),
  description: Joi.string().max(10000).allow('', null).optional(),
  target_amount: Joi.number().integer().min(100000).optional(),
  banner_image: Joi.string().uri().max(500).allow('', null).optional(),
  deadline: Joi.date().iso().allow(null).optional(),
}).min(1);

module.exports = { submitCampaignSchema, updateMyCampaignSchema };
