const Joi = require("joi");

const createCropSchema = Joi.object({
    crop_name:Joi.string().max(255).required(),
    crop_species:Joi.string().max(255).optional(),
    harvest_result:Joi.number().required(),
    harvest_time: Joi.number().required(),
})

module.exports = createCropSchema