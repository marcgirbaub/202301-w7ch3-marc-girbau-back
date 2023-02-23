import multer from "multer";
import { validate } from "express-validation";
import { Router } from "express";
import {
  createUser,
  loginUser,
} from "../../controllers/usersControllers/usersControllers.js";
import registerSchema from "../../schemas/registerSchemas.js";

const usersRouter = Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/");
  },
  filename(req, file, callback) {
    callback(null, file.originalname + ".jpeg");
  },
});

export const upload = multer({ storage });

usersRouter.post(
  "/register",
  upload.single("avatar"),
  validate(registerSchema, {}, { abortEarly: false }),
  createUser
);
usersRouter.post("/login", loginUser);

export default usersRouter;
