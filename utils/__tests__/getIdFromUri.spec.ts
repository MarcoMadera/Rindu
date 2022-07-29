import { getIdFromUri } from "utils/getIdFromUri";

describe("getIdFromUri", () => {
  it("should return the correct id", () => {
    expect.assertions(1);
    const id = getIdFromUri("spotify:user:12345", "id");
    expect(id).toBe("12345");
  });

  it("should return the correct type", () => {
    expect.assertions(1);
    const id = getIdFromUri("spotify:user:12345", "type");
    expect(id).toBe("user");
  });

  it("should return empty string if not type provided", () => {
    expect.assertions(1);
    const id = getIdFromUri("spotify:user:12345");
    expect(id).toBe("");
  });
});
