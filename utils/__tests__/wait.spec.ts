import { wait } from "utils/wait";

describe("wait", () => {
  it("should wait for the given time", async () => {
    expect.assertions(1);

    const start = Date.now();
    await wait(110);
    const end = Date.now();

    expect(end - start).toBeGreaterThanOrEqual(100);
  });
});
