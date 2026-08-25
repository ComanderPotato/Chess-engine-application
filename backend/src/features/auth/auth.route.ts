import express from "express";
import * as auth_controller from "./auth.controller.js";
import { signupSchema, validate } from "./auth.validation.js";

const router = express.Router();

router.post("/login", auth_controller.login);
router.post("/signup", validate("body", signupSchema), auth_controller.signup);
router.post("/logout", auth_controller.logout);

export default router;
