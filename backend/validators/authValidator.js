// backend/validators/authValidator.js
import Joi from "joi";

// 🟩 Register Validation
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email address",
    "string.empty": "Email is required",
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Username is required",
    "string.alphanum": "Username must only contain letters and numbers",
  }),
  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d).+$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter and one number",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
    }),
});

// 🟩 Login Validation
export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

