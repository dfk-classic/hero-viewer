import { describe, it, expect } from "vitest";
import { calculateRemainingStamina } from "../../src/components/Heroes/utils/staminaCalculations";
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
});
