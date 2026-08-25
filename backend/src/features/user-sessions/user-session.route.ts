import express from "express";

const router = express.Router();

router.get("/", () => undefined);
router.post("/", () => undefined);
router.get("/:userSessionId", () => undefined);
router.patch("/:userSessionId", () => undefined);
router.delete("/:userSessionId", () => undefined);

export default router;
