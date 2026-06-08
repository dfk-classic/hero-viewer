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
		// All-zero genes: background has a code-0 entry (desert); gender starts at code 1, so its code-0 lookup is intentionally undefined.
		const decoded = convertGenes(genesToBigNumber({}), visualGenesMap);
		expect(decoded.background).toBe("desert");
		expect(decoded.gender).toBeUndefined();
	});

	it("left-pads short gene values so a high-index trait still aligns", () => {
		// Encoding only trait 10 yields a number a few kai digits wide, far short of the full 48. genesToKai must left-pad with zero-equivalent kai before the per-trait slice, otherwise the dominant nibble would land under the wrong trait. The high trait decodes to its real choice while every lower, unset trait falls back to its code-0 value (background -> desert).
		const decoded = convertGenes(genesToBigNumber({ 10: 7 }), visualGenesMap);
		expect(decoded.backAppendageColor).toBe("6f3a3c");
		expect(decoded.background).toBe("desert");
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
		// statsGenesMap indices: 0 -> class, 1 -> subClass, 10 -> element. summoner (18) / thief sub (2) / dark element (14).
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

	it("keeps element as a string when the element nibble is off-spec instead of leaking undefined", () => {
		// choices.element maps only even codes 0,2,4,6,8,10,12,14; any odd dominant nibble (e.g. code 1 at statsGenesMap index 10) decodes to undefined from convertGenes. buildHero must still surface element as a real string or the undefined punches through the typed Hero contract and breaks the element icon lookup in SpecialsRow downstream.
		const hero = buildHero(makeRawHero({ statGenes: genesToBigNumber({ 10: 1 }) }));
		expect(hero.element).toBe("");
		expect(typeof hero.element).toBe("string");
	});

	it("keeps background as a string when the background nibble is off-spec instead of leaking undefined", () => {
		// choices.background maps only even codes 0,2,4,6,8,10,12,14; any odd dominant nibble (e.g. code 1 at visualGenesMap index 3) decodes to undefined from convertGenes. buildHero must still surface background as a real string or the undefined punches through the typed Hero contract.
		const hero = buildHero(makeRawHero({ visualGenes: genesToBigNumber({ 3: 1 }) }));
		expect(hero.background).toBe("");
		expect(typeof hero.background).toBe("string");
	});

	it("keeps class as a string when the class nibble is off-spec instead of leaking undefined", () => {
		// choices.class maps 0-11, 16-21, 24-26, 28; code 12 is a gap — any nibble code without an entry decodes to undefined from convertGenes. buildHero must still surface class as a real string.
		const hero = buildHero(makeRawHero({ statGenes: genesToBigNumber({ 0: 12 }) }));
		expect(hero.class).toBe("");
		expect(typeof hero.class).toBe("string");
	});

	it("keeps subClass as a string when the subClass nibble is off-spec instead of leaking undefined", () => {
		// choices.subClass has the same gaps as choices.class; code 12 at statsGenesMap index 1 decodes to undefined. buildHero must still surface subClass as a real string.
		const hero = buildHero(makeRawHero({ statGenes: genesToBigNumber({ 1: 12 }) }));
		expect(hero.subClass).toBe("");
		expect(typeof hero.subClass).toBe("string");
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

	it.each([
		["common", 0],
		["uncommon", 1],
		["rare", 2],
		["legendary", 3],
		["mythic", 4],
	])("resolves subgraph rarity string %s to numeric index %i and back", (rarityName, rarityIdx) => {
		// subgraph format identified by string id; rarity arrives as a lowercase tier name that the normalisation block converts to its numeric index so the on-chain path still applies to the return block. Regression guard for the subgraph string-to-index conversion.
		const hero = buildHero(makeRawHero({ id: "1", rarity: rarityName }));
		expect(hero.rarity).toBe(rarityName);
		expect(hero.rarityNum).toBe(rarityIdx);
	});

	it("falls back to common when the subgraph delivers an unrecognised rarity tier name", () => {
		// RARITY_LEVELS.indexOf of an unrecognised name returns -1; before the fix buildHero mutated heroRaw.info.rarity to -1, then RARITY_LEVELS[-1] produced undefined for hero.rarity and -1 for hero.rarityNum — both violating the Hero contract. Regression guard for the indexOf-guard and the common fallback.
		const hero = buildHero(makeRawHero({ id: "1", rarity: "unknown" }));
		expect(hero.rarity).toBe("common");
		expect(hero.rarityNum).toBe(0);
	});

	it("treats equal non-zero start and end prices as a fixed-price sale, not an auction", () => {
		// A declining auction needs distinct start/end prices; equal prices are a flat listing, so onAuction stays false even though both prices parse to a real value.
		const hero = buildHero(
			makeRawHero({ startingPrice: "1000000000000000000", endingPrice: "1000000000000000000" }),
		);
		expect(hero.auction.onAuction).toBe(false);
		expect(hero.auction.startingPrice).toBe(1);
		expect(hero.auction.endingPrice).toBe(1);
	});

	it.each([
		[10, 0, 10],
		[10, 3, 7],
		[11, 4, 11],
		[20, 9, 11],
	])("derives summonsRemaining for maxSummons %i and summons %i", (maxSummons, summons, remaining) => {
		// Below 11 the remaining count is the literal difference; at 11 or above the value is pinned to 11, the sentinel for an effectively unlimited summoner.
		const hero = buildHero(makeRawHero({ maxSummons, summons }));
		expect(hero.summonsRemaining).toBe(remaining);
	});

	it("zeroes the shiny style on a non-shiny hero and preserves it on a shiny one", () => {
		const plain = buildHero(makeRawHero({ shiny: false, shinyStyle: 5 }));
		expect(plain.shiny).toBe(false);
		expect(plain.shinyStyle).toBe(0);
		const shiny = buildHero(makeRawHero({ shiny: true, shinyStyle: 5 }));
		expect(shiny.shiny).toBe(true);
		expect(shiny.shinyStyle).toBe(5);
	});

	it("derives firstName, lastName and name from the same on-chain info indices", () => {
		// Regression guard: firstName/lastName were read from a synthetic top-level heroRaw.firstName/heroRaw.lastName that the real ethers getHero tuple never carries, while name read the canonical heroRaw.info.firstName/info.lastName, so on an on-chain-shaped hero the two diverged - name resolved while firstName/lastName came back undefined and the built hero's own name invariant broke. All three now read heroRaw.info.*.
		const hero = buildHero(makeRawHero({ firstName: 0, lastName: 0 }));
		expect(hero.firstName).toBeTruthy();
		expect(hero.lastName).toBeTruthy();
		expect(hero.name).toBe(`${hero.firstName} ${hero.lastName}`);
	});

	it("keeps gender and firstName as strings when the gender nibble is off-spec instead of leaking undefined", () => {
		// choices.gender only maps codes 1 (male) and 3 (female); any other dominant nibble decodes gender to undefined. Both gender and firstName must still surface as strings or an off-spec gene would punch undefined through the typed Hero contract and break the name invariant downstream.
		const hero = buildHero(makeRawHero({ visualGenes: genesToBigNumber({ 0: 2 }) }));
		expect(hero.gender).toBe("");
		expect(hero.firstName).toBe("");
		expect(typeof hero.gender).toBe("string");
		expect(typeof hero.firstName).toBe("string");
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
		// Each level sits at the bottom of a piecewise tier, so the value must equal the constant term of that tier — proving the breakpoints join continuously with no gap or overlap.
		expect(calculateRequiredXp(level)).toBe(expected);
	});
});
