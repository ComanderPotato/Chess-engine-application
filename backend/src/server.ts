import express from "express";
import path from "path";
import registerRoutes from "./features/index.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./shared/middleware/error-handler.middleware.js";
import { bypassAuth } from "./shared/middleware/bypass-auth.middleware.js";
const app = express();

// const __dirname = path.resolve(_);

app.use(bypassAuth);
app.use(express.json());
app.use(cookieParser());
registerRoutes(app);
app.use(errorHandler);
app.use(express.static("public"));
app.use("/dist", express.static("dist"));
app.get("/health", (req, res) => {
  const sessionId = req.cookies.sessionId;
  // console.log(sessionId);
  res.cookie("Monster", "42");
  res.status(200).json({ status: "ok", sessionId });
});
app.get("/", (req, res) => {});

export default app;
