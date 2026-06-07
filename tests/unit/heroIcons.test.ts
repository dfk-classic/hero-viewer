import { describe, it, expect } from "vitest";
import {
	elementIcons,
	backgroundIcons,
	rarityIcons,
	genderIcons,
} from "../../src/components/Heroes/HeroCard/heroIcons";

// Each trait-value → icon map must cover every documented trait value and resolve to a non-empty asset path, so the card never silently drops a badge when a hero carries a valid trait.
describe("heroIcons", () => {
	const cases: [string, Record<string, string>, string[]][] = [
		[
			"elementIcons",
			elementIcons,
			["fire", "water", "earth", "wind", "lightning", "ice", "light", "dark"],
		],
		[
			"backgroundIcons",
			backgroundIcons,
			["arctic", "city", "desert", "forest", "island", "mountains", "plains", "swamp"],
		],
		[
			"rarityIcons",
			rarityIcons,
			["common", "uncommon", "rare", "legendary", "mythic"],
		],
		["genderIcons", genderIcons, ["female", "male"]],
	];

	it.each(cases)("%s covers every key with a non-empty path", (_name, map, keys) => {
		expect(Object.keys(map).sort()).toEqual([...keys].sort());
		for (const key of keys) {
			expect(typeof map[key]).toBe("string");
			expect(map[key].length).toBeGreaterThan(0);
		}
	});
});
