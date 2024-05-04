const Joi = require("joi");

const createFarmSchema = Joi.object({
    farm_name: Joi.string().max(255).required().label("Farm Name")
})

module.exports = createFarmSchema