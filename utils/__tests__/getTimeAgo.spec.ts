import { getTimeAgo } from "utils/getTimeAgo";

describe("getTimeAgo", () => {
  it("should return time ago for one week", () => {
    expect.assertions(1);
    const timeAgo = getTimeAgo(Date.now() - 1000 * 60 * 60 * 24 * 7, "en-US");
    expect(timeAgo).toBe("1 week ago");
  });

  it("should return time ago for one month", () => {
    expect.assertions(1);
    const timeAgo = getTimeAgo(
      Date.now() - 1000 * 60 * 60 * 24 * 7 * 4,
      "en-US"
    );
    expect(timeAgo).toBe("1 month ago");
  });

  it("should return time ago for one year", () => {
    expect.assertions(1);
    const timeAgo = getTimeAgo(
      Date.now() - 1000 * 60 * 60 * 24 * 7 * 4 * 12,
      "en-US"
    );
    expect(timeAgo).toBe("1 year ago");
  });

  it("should return in 2 weeks", () => {
    expect.assertions(1);
    const timeAgo = getTimeAgo(
      Date.now() - 1000 * 60 * 60 * 24 * 14 * -1,
      "en-US"
    );
    expect(timeAgo).toBe("in 2 weeks");
  });

  it("should return in 2 years", () => {
    expect.assertions(1);
    const timeAgo = getTimeAgo(
      Date.now() - 1000 * 60 * 60 * 24 * 7 * 4 * 16 * -1,
      "en-US"
    );
    expect(timeAgo).toBe("in 2 years");
  });
});
