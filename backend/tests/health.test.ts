import { describe, expect, it } from "vitest";
import { api } from "./helpers/request";

describe("Fart", () => {
  it("Shits", async () => {
    const response = await api.get("/health").set("Cookie", "sessionId=10");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.sessionId).toBe("10");

    const responseSec = await api.get("/health").set("Cookie", "sessionId=10");

    expect(responseSec.body.sessionId).toBe("10");
  });
});
