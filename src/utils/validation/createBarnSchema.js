const Joi = require("joi");

const createBarnSchema = Joi.object({
    post_code: Joi.number().integer().greater(99999).less(1000000).label("Post Code").required()
    .messages({
        "number.less" : "{{#label}} must be a 6 digit number!",
        "number.greater" : "{{#label}} must be a 6 digit number!",
    })
})

module.exports = createBarnSchema