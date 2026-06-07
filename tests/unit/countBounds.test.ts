import { describe, it, expect } from "vitest";
import { MIN_COUNT, MAX_COUNT, clampCount } from "../../src/countBounds";

describe("count bounds", () => {
	it("pins MIN_COUNT and MAX_COUNT so the input attrs and clamp stay in sync", () => {
		// Guards against an accidental swap or drift between these constants and the
		// values the input previously hard-coded (min={1} max={60}).
		expect(MIN_COUNT).toBe(1);
		expect(MAX_COUNT).toBe(60);
		expect(MIN_COUNT).toBeLessThan(MAX_COUNT);
	});
});

describe("clampCount", () => {
	it("passes through values already inside the range", () => {
		expect(clampCount(8)).toBe(8);
		expect(clampCount("30")).toBe(30);
		expect(clampCount(MIN_COUNT)).toBe(MIN_COUNT);
		expect(clampCount(MAX_COUNT)).toBe(MAX_COUNT);
	});

	it("clamps values above MAX_COUNT down to MAX_COUNT", () => {
		expect(clampCount(100)).toBe(MAX_COUNT);
		expect(clampCount("999")).toBe(MAX_COUNT);
	});

	it("falls back to MIN_COUNT for empty, zero, negative, or non-numeric input", () => {
		// Mirrors the original `Number(value) || 1` then Math.max(1, …): "" and "abc"
		// coerce to 0/NaN (falsy → MIN_COUNT), 0 is falsy, and negatives clamp up.
		expect(clampCount("")).toBe(MIN_COUNT);
		expect(clampCount("abc")).toBe(MIN_COUNT);
		expect(clampCount(0)).toBe(MIN_COUNT);
		expect(clampCount(-5)).toBe(MIN_COUNT);
	});
});
