import { Joi } from "express-validation";

const registerSchema = {
  body: Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).max(24).required(),
    email: Joi.string().required(),
    image: Joi.string(),
  }),
};

export default registerSchema;
