import request from "supertest";
import { createTestApp } from "../setup/app";

const app = createTestApp();

export const api = request(app);
