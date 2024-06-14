const Joi = require("joi");

const update = Joi.object({
    item_id: Joi.string().required(),
    item_name: Joi.string().max(100).optional(),
    description: Joi.string().max(255).optional(),
    price: Joi.number().optional()
})

module.exports = { update }