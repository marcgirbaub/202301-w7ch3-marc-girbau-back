import multer from "multer";
import { uuid } from "uuidv4";
import { validate } from "express-validation";
import { Router } from "express";
import {
  createUser,
  loginUser,
} from "../../controllers/usersControllers/usersControllers.js";
import registerSchema from "../../schemas/registerSchemas.js";

const usersRouter = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, callback) {
    const suffix = uuid();
    const extension =
      file.mimetype.split("/")[file.mimetype.split("/").length - 1];
    callback(null, `${file.originalname.split(".")[0]}-${suffix}.${extension}`);
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
