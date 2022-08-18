import { divideArray } from "utils/divideArray";

describe("divideArray", () => {
  it("should divide an array into two halves", () => {
    expect.assertions(2);
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [left, right] = divideArray(array, 5);
    expect(left).toStrictEqual([1, 2, 3, 4, 5]);
    expect(right).toStrictEqual([6, 7, 8, 9, 10]);
  });
});
