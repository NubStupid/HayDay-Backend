const Joi = require("joi");

const createChefSchema = Joi.object({
    fnb_name: Joi.string().max(100).required(),
    description: Joi.string().max(255).optional(),
    type: Joi.string().valid("F", "B").required(),
    price: Joi.number().required()
})

const update = Joi.object({
    fnb_id: Joi.string().required(),
    fnb_name: Joi.string().max(100).optional(),
    description: Joi.string().max(255).optional(),
    price: Joi.number().optional()
})

module.exports = {createChefSchema, update}