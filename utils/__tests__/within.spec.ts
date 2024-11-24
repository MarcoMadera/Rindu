import { IUtilsMocks } from "types/mocks";
import { TimeOutError, within } from "utils";
const { resolvePromise, rejectPromise } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("within", () => {
  it("should resolve a promise within time", async () => {
    expect.assertions(3);

    const start = performance.now();
    const { error, data } = await within(resolvePromise(1, 100), 500);
    const end = performance.now();

    expect(error).toBeNull();
    expect(data).toBe(1);
    expect(end - start).toBeLessThanOrEqual(550);
  });

  it("should reject a promise within time", async () => {
    expect.assertions(3);

    const { data, error, id } = await within(rejectPromise(), 10, "test");

    expect(error).toStrictEqual(new TimeOutError(10));
    expect(data).toBeNull();
    expect(id).toBe("test");
  });
});
