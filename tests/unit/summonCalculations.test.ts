import { describe, it, expect } from "vitest";
import { calculateHeroSummonCost } from "../../src/components/Heroes/utils/summonCalculations";

// Cost model: base 6 + 2 per hero already summoned + 10 per summoner generation. A generation-0 hero is capped at 30; any higher generation is uncapped.
describe("calculateHeroSummonCost", () => {
	it("returns the base cost for a fresh gen-0 summoner", () => {
		expect(calculateHeroSummonCost(0, 0)).toBe(6);
	});

	it("adds 2 for every hero already summoned", () => {
		expect(calculateHeroSummonCost(0, 5)).toBe(16);
	});

	it("adds 10 for every generation above 0", () => {
		expect(calculateHeroSummonCost(1, 0)).toBe(16);
		expect(calculateHeroSummonCost(3, 0)).toBe(36);
	});

	it("combines per-child and per-generation increases", () => {
		expect(calculateHeroSummonCost(1, 5)).toBe(26);
	});

	it("does not cap a gen-0 cost that lands exactly on 30", () => {
		// 6 + 2*12 = 30 — at the boundary, not above it, so no cap is applied.
		expect(calculateHeroSummonCost(0, 12)).toBe(30);
	});

	it("caps a gen-0 cost above 30 at 30", () => {
		expect(calculateHeroSummonCost(0, 13)).toBe(30);
		expect(calculateHeroSummonCost(0, 100)).toBe(30);
	});

	it("never caps a higher-generation summoner, even past 30", () => {
		// gen 1, 13 children = 6 + 26 + 10 = 42; the cap is gen-0 only.
		expect(calculateHeroSummonCost(1, 13)).toBe(42);
		expect(calculateHeroSummonCost(5, 0)).toBe(56);
	});
});
