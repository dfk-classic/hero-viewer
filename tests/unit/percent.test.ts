import { describe, it, expect } from "vitest";
import { capPercent } from "../../src/components/Heroes/utils/percent";

describe("capPercent", () => {
	it("passes through values at or below 100", () => {
		expect(capPercent(0)).toBe(0);
		expect(capPercent(42.5)).toBe(42.5);
		expect(capPercent(100)).toBe(100);
	});

	it("caps values above 100 at 100", () => {
		expect(capPercent(100.0001)).toBe(100);
		expect(capPercent(250)).toBe(100);
	});
});
