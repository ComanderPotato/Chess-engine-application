import express from "express";

const router = express.Router();

router.get("/", (req, res) => {});
router.post("/", () => undefined);
router.get("/:userSessionId", () => undefined);
router.patch("/:userSessionId", () => undefined);
router.delete("/:userSessionId", () => undefined);

export default router;
