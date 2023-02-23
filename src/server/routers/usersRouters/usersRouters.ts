import { validate } from "express-validation";
import { Router } from "express";
import {
  createUser,
  loginUser,
} from "../../controllers/usersControllers/usersControllers.js";
import registerSchema from "../../schemas/registerSchemas.js";

const usersRouter = Router();

usersRouter.post("/login", loginUser);
usersRouter.post(
  "/register",
  validate(registerSchema, {}, { abortEarly: false }),
  createUser
);

export default usersRouter;
