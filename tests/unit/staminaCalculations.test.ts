import { describe, it, expect } from "vitest";
import { DateTime } from "luxon";
import { calculateRemainingStamina, staminaFullLabel } from "../../src/components/Heroes/utils/staminaCalculations";
import { makeHero } from "../helpers/heroFixtures";

const nowSeconds = () => Math.floor(Date.now() / 1000);

describe("calculateRemainingStamina", () => {
	it("returns full stamina once the recharge time has passed", () => {
		const hero = makeHero({ stamina: 25, staminaFullAt: nowSeconds() - 3600 });
		expect(calculateRemainingStamina(hero)).toBe(25);
	});

	it("returns full stamina when there is no recharge timestamp", () => {
		const hero = makeHero({ stamina: 25, staminaFullAt: 0 });
		expect(calculateRemainingStamina(hero)).toBe(25);
	});

	it("subtracts one point per 1200s still remaining until full", () => {
		// 7200s out -> ceil(7200 / 1200) = 6 points still recharging -> 25 - 6 = 19.
		const hero = makeHero({ stamina: 25, staminaFullAt: nowSeconds() + 7200 });
		expect(calculateRemainingStamina(hero)).toBe(19);
	});

	it("rounds a partial sub-1200s remainder up to a full point", () => {
		// Any time still on the clock costs a whole point: ceil(600 / 1200) = 1 -> 25 - 1 = 24.
		const hero = makeHero({ stamina: 25, staminaFullAt: nowSeconds() + 600 });
		expect(calculateRemainingStamina(hero)).toBe(24);
	});

	it("clamps at zero when the recharge time is further out than the stamina pool", () => {
		// 12000s out -> 10 points recharging, but the hero only holds 5; the result must not go negative. Regression guard for the non-negative-stamina invariant.
		const hero = makeHero({ stamina: 5, staminaFullAt: nowSeconds() + 12000 });
		expect(calculateRemainingStamina(hero)).toBe(0);
	});

	it("treats the exact recharge moment as fully recharged", () => {
		// staminaFullAt at (or just before) now hits the <= branch and returns the full pool.
		const hero = makeHero({ stamina: 25, staminaFullAt: nowSeconds() });
		expect(calculateRemainingStamina(hero)).toBe(25);
	});
});

describe("staminaFullLabel", () => {
	it("returns a plain \"Full\" for a null recharge time instead of dereferencing it", () => {
		// Regression guard: the component built the label as `"Full " + staminaFullAt.toRelative()` before the null check, so a null staminaFullAt threw a TypeError on toRelative before the guard could ever run.
		expect(staminaFullLabel(null, DateTime.now())).toBe("Full");
	});

	it("returns a plain \"Full\" for an invalid DateTime instead of \"Full null\"", () => {
		// Regression guard: an out-of-range DateTime.fromSeconds(NaN) (the real path when an on-chain value fails to parse) is a truthy, never-<=-now object whose toRelative() is null, so the old concatenation rendered the literal string "Full null".
		expect(staminaFullLabel(DateTime.fromSeconds(NaN), DateTime.now())).toBe("Full");
	});

	it("prefixes the relative time when the recharge moment is still in the future", () => {
		const now = DateTime.now();
		expect(staminaFullLabel(now.plus({ hours: 2 }), now)).toBe("Full in 2 hours");
	});

	it("collapses to \"Full\" once the recharge moment has passed", () => {
		const now = DateTime.now();
		expect(staminaFullLabel(now.minus({ hours: 2 }), now)).toBe("Full");
	});
});
