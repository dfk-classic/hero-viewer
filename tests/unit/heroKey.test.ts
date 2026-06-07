import { describe, it, expect } from "vitest";
import { heroKey } from "../../src/heroKey";
import type { Hero } from "../../src/types/hero";

// heroKey only reads `id`; build the minimal shape the helper accepts without standing up a full Hero.
function withId(id: number | undefined): Pick<Hero, "id"> {
	return { id } as unknown as Pick<Hero, "id">;
}

describe("heroKey", () => {
	it("keys on the hero id, independent of array position", () => {
		// The regression: the old key embedded the filtered-array index, so the same hero produced a different key once an earlier slot resolved and shifted its position, remounting its subtree. A stable identity must survive that shift.
		expect(heroKey(withId(12345), 0)).toBe(heroKey(withId(12345), 4));
	});

	it("gives distinct heroes distinct keys", () => {
		expect(heroKey(withId(1), 0)).not.toBe(heroKey(withId(2), 0));
	});

	it("returns a string key prefixed so a numeric id never collides with a fallback index", () => {
		expect(heroKey(withId(7), 3)).toBe("#7");
	});

	it("falls back to a distinctly-prefixed array index when a hero has no id, so it cannot collide with a real id key", () => {
		expect(heroKey(withId(undefined), 5)).toBe("i5");
		expect(heroKey(withId(undefined), 7)).not.toBe(heroKey(withId(7), 0));
	});
});
