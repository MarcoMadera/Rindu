import { formatTime } from "utils/formatTime";

describe("formatTime", () => {
  it("should format Time", () => {
    expect.assertions(10);
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(1)).toBe("0:01");
    expect(formatTime(20)).toBe("0:20");
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(61)).toBe("1:01");
    expect(formatTime(3600)).toBe("1:00:00");
    expect(formatTime(3601)).toBe("1:00:01");
    expect(formatTime(3661)).toBe("1:01:01");
    expect(formatTime(3661 * 60)).toBe("61:01:00");
    expect(formatTime(3661 * 60 + 1)).toBe("61:01:01");
  });
});
