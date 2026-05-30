const Joi = require('joi');

const createDonationSchema = Joi.object({
  campaign_id: Joi.number().integer().positive().required(),
  amount: Joi.number().integer().min(10000).required(),
  message: Joi.string().max(500).allow('', null).optional(),
  is_anonymous: Joi.boolean().optional(),
  payment_method: Joi.string().valid('qris', 'bank_transfer').optional(),
  bank_code: Joi.string().valid('bca', 'bni', 'bri', 'mandiri', 'bsi').when('payment_method', {
    is: 'bank_transfer',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  squad_id: Joi.number().integer().positive().allow(null).optional(),
});

module.exports = { createDonationSchema };
