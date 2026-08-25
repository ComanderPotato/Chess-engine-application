import { beforeAll, beforeEach, afterAll } from "vitest";
import fs from "fs";
process.env.MONGOMS_DEBUG = "1";
process.env.MONGOMS_CACHE_DIR = "./mongo-cache";
process.env.MONGOMS_DOWNLOAD_DIR = "./mongo-cache";
fs.mkdirSync("./mongo-cache", { recursive: true });
// fs.mkdirSync("./mongo-cache/db", { recursive: true });
import { connectDB, clearDB, disconnectDB } from "./db";

// beforeAll(async () => {
//   await connectDB();
// });
// //
// beforeEach(async () => {
//   await clearDB();
// });
//
// afterAll(async () => {
//   await disconnectDB();
// });
