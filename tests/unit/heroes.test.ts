import { describe, it, expect } from "vitest";
import buildHero, {
	convertGenes,
	visualGenesMap,
	calculateRequiredXp,
} from "../../src/components/Heroes/HeroInfo/utils/heroes";
import { genesToBigNumber, makeRawHero } from "../helpers/heroFixtures";

describe("convertGenes", () => {
	it("decodes dominant visual traits to their named choices", () => {
		// trait 0 dominant code 1 -> gender male, trait 3 dominant code 2 -> background forest.
		const decoded = convertGenes(genesToBigNumber({ 0: 1, 3: 2 }), visualGenesMap);
		expect(decoded.gender).toBe("male");
		expect(decoded.background).toBe("forest");
	});

	it("decodes the code-0 nibble and leaves traits without a 0 choice undefined", () => {
		// All-zero genes: background has a code-0 entry (desert); gender starts at code 1, so its
		// code-0 lookup is intentionally undefined.
		const decoded = convertGenes(genesToBigNumber({}), visualGenesMap);
		expect(decoded.background).toBe("desert");
		expect(decoded.gender).toBeUndefined();
	});

	it("decodes colour and appendage traits across the trait map", () => {
		// visualGenesMap indices: 1 -> headAppendage, 5 -> hairColor, 7 -> eyeColor, 8 -> skinColor.
		const decoded = convertGenes(genesToBigNumber({ 1: 16, 5: 7, 7: 14, 8: 2 }), visualGenesMap);
		expect(decoded.hairColor).toBe("62a7e6");
		expect(decoded.eyeColor).toBe("a41e12");
		expect(decoded.skinColor).toBe("f1ca9e");
		// headAppendage choices map a code to itself (a numeric id, not a string).
		expect(decoded.headAppendage).toBe(16);
	});
});

describe("buildHero", () => {
	it("maps raw on-chain fields onto the Hero contract", () => {
		const hero = buildHero(makeRawHero({ id: 42, xp: 1234, level: 5 }));
		expect(hero.id).toBe(42);
		expect(hero.heroId).toBe(42);
		expect(hero.xp).toBe(1234);
		expect(hero.level).toBe(5);
		expect(hero.class).toBe("knight");
		expect(hero.gender).toBe("male");
		expect(hero.background).toBe("forest");
		expect(hero.rarity).toBe("common");
		expect(hero.rarityNum).toBe(0);
	});

	it("flags a hero as questing when its current quest is not the zero address", () => {
		const idle = buildHero(makeRawHero());
		const questing = buildHero(
			makeRawHero({ currentQuest: "0x0000000000000000000000000000000000000123" }),
		);
		expect(idle.isQuesting).toBe(false);
		expect(questing.isQuesting).toBe(true);
	});

	it("derives auction state from the starting and ending prices", () => {
		const flat = buildHero(makeRawHero());
		expect(flat.auction.onAuction).toBe(false);
		const live = buildHero(makeRawHero({ startingPrice: "1000000000000000000", endingPrice: "2000000000000000000" }));
		expect(live.auction.onAuction).toBe(true);
		expect(live.auction.startingPrice).toBe(1);
		expect(live.auction.endingPrice).toBe(2);
	});

	it("decodes class, subClass and element from the stat genes", () => {
		// statsGenesMap indices: 0 -> class, 1 -> subClass, 10 -> element.
		// summoner (18) / thief sub (2) / dark element (14).
		const hero = buildHero(makeRawHero({ statGenes: genesToBigNumber({ 0: 18, 1: 2, 10: 14 }) }));
		expect(hero.class).toBe("summoner");
		expect(hero.subClass).toBe("thief");
		expect(hero.element).toBe("dark");
	});

	it("decodes a different class/element pair to prove the mapping is data-driven", () => {
		const hero = buildHero(makeRawHero({ statGenes: genesToBigNumber({ 0: 28, 1: 16, 10: 0 }) }));
		expect(hero.class).toBe("dreadKnight");
		expect(hero.subClass).toBe("paladin");
		expect(hero.element).toBe("fire");
	});

	it.each([
		[0, "common"],
		[1, "uncommon"],
		[2, "rare"],
		[3, "legendary"],
		[4, "mythic"],
	])("maps numeric rarity %i onto the %s tier name", (rarityNum, name) => {
		const hero = buildHero(makeRawHero({ rarity: rarityNum }));
		expect(hero.rarity).toBe(name);
		expect(hero.rarityNum).toBe(rarityNum);
	});
});

describe("calculateRequiredXp", () => {
	it.each([
		[1, 2000],
		[5, 6000],
		[6, 8000],
		[9, 16000],
		[16, 45000],
		[36, 147500],
		[56, 300000],
	])("returns %i -> %i xp for the next level", (level, expected) => {
		expect(calculateRequiredXp(level)).toBe(expected);
	});

	it.each([
		[0, 1000],
		[8, 12000],
		[15, 40000],
		[35, 140000],
		[55, 290000],
		[100, 740000],
	])("lands on each tier's lower boundary: level %i -> %i xp", (level, expected) => {
		// Each level sits at the bottom of a piecewise tier, so the value must equal the constant
		// term of that tier — proving the breakpoints join continuously with no gap or overlap.
		expect(calculateRequiredXp(level)).toBe(expected);
	});
});
