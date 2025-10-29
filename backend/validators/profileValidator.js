import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  address: Joi.string().allow("", null).max(200).messages({
    "string.max": "Address cannot exceed 200 characters",
  }),
  phoneNumbers: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9]{10}$/)
        .messages({
          "string.pattern.base": "Each phone number must be exactly 10 digits",
        })
    )
    .min(1)
    .messages({
      "array.min": "At least one phone number is required",
    }),
});
