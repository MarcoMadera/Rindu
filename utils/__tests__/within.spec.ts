import { IUtilsMocks } from "types/mocks";
import { within } from "utils";

const { resolvePromise, rejectPromise } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("whiting", () => {
  it("should resolve a promise whitin time", async () => {
    expect.assertions(3);
    const start = Date.now();
    const { error, data } = await within(resolvePromise(1), 500);
    const end = Date.now();
    expect(error).toBeNull();
    expect(data).toBe(1);
    expect(end - start).toBeLessThanOrEqual(550);
  });

  it("should reject a promise whitin time", async () => {
    expect.assertions(3);
    const { data, error, id } = await within(rejectPromise(), 10, "test");
    expect(error).toBe("timeout");
    expect(data).toBeNull();
    expect(id).toBe("test");
  });
});
