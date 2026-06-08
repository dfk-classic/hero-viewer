// Full gene translator for the card back: every stat and visual trait, all four slots (dominant + 3 recessives), mapped to display names.
//
// Mappings match HONK Marketplace's heroUtils.js and the dfk-classic transcended-roster exporter (lib/decode.mjs), so the viewer, the marketplace and the dataset all read the same hero identically.
//
// Slot positions follow the DFK kai encoding: each trait is a 4-char group, char1=r3, char2=r2, char3=r1, char4=dominant.
//
// Known HONK quirk, intentionally NOT reproduced: HONK's recessive tab display swaps active1/active2 (formatRecessiveStatGenes in heroGeneParser.js). The swap has no basis in the gene encoding (dominants and passives are never swapped), so this translator keeps documented trait order.

export const CLASS_NAMES: Record<number, string> = {
	0: "Warrior", 1: "Knight", 2: "Thief", 3: "Archer", 4: "Priest",
	5: "Wizard", 6: "Monk", 7: "Pirate", 8: "Berserker", 9: "Seer",
	10: "Legionnaire", 11: "Scholar", 16: "Paladin", 17: "DarkKnight",
	18: "Summoner", 19: "Ninja", 20: "Shapeshifter", 21: "Bard",
	24: "Dragoon", 25: "Sage", 26: "SpellBow", 28: "DreadKnight",
};
export const ELEMENT_NAMES: Record<number, string> = {
	0: "fire", 2: "water", 4: "earth", 6: "wind",
	8: "lightning", 10: "ice", 12: "light", 14: "dark",
};
export const PROFESSION_NAMES: Record<number, string> = {
	0: "mining", 2: "gardening", 4: "fishing", 6: "foraging",
};
export const STAT_BOOST_NAMES: Record<number, string> = {
	0: "STR", 2: "AGI", 4: "INT", 6: "WIS",
	8: "LCK", 10: "VIT", 12: "END", 14: "DEX",
};
export const CRAFTING_NAMES: Record<number, string> = {
	0: "Blacksmithing", 2: "Goldsmithing", 4: "Armorsmithing", 6: "Woodworking",
	8: "Leatherworking", 10: "Tailoring", 12: "Enchanting", 14: "Alchemy",
};
// Named abilities, "Name (Tier)" format exactly as HONK renders them.
export const ACTIVE_NAMES: Record<number, string> = {
	0: "Poisoned Blade (Basic1)", 1: "Blinding Winds (Basic2)", 2: "Heal (Basic3)",
	3: "Cleanse (Basic4)", 4: "Iron Skin (Basic5)", 5: "Critical Aim (Basic6)",
	6: "Speed (Basic7)", 7: "Deathmark (Basic8)", 16: "Exhaust (Advanced1)",
	17: "Daze (Advanced2)", 18: "Explosion (Advanced3)", 19: "Hardened Shield (Advanced4)",
	24: "Stun (Elite1)", 25: "Second Wind (Elite2)", 28: "Resurrection (Exalted1)",
};
export const PASSIVE_NAMES: Record<number, string> = {
	0: "Duelist (Basic1)", 1: "Clutch (Basic2)", 2: "Foresight (Basic3)",
	3: "Headstrong (Basic4)", 4: "Clear Vision (Basic5)", 5: "Fearless (Basic6)",
	6: "Chatterbox (Basic7)", 7: "Stalwart (Basic8)", 16: "Leadership (Advanced1)",
	17: "Efficient (Advanced2)", 18: "Menacing (Advanced3)", 19: "Toxic (Advanced4)",
	24: "Giant Slayer (Elite1)", 25: "Last Stand (Elite2)", 28: "Second Life (Exalted1)",
};
export const GENDER_NAMES: Record<number, string> = { 1: "male", 3: "female" };
export const BACKGROUND_NAMES: Record<number, string> = {
	0: "desert", 2: "forest", 4: "plains", 6: "island",
	8: "swamp", 10: "mountains", 12: "city", 14: "arctic",
};

export const STAT_TRAITS = [
	"mainClass", "subClass", "profession", "passive1", "passive2", "active1",
	"active2", "statBoost1", "statBoost2", "crafting1", "element", "crafting2",
] as const;
export const VISUAL_TRAITS = [
	"gender", "headAppendage", "backAppendage", "background", "hairStyle",
	"hairColor", "visualUnknown1", "eyeColor", "skinColor", "appendageColor",
	"backAppendageColor", "visualUnknown2",
] as const;

export type StatTrait = (typeof STAT_TRAITS)[number];
export type VisualTrait = (typeof VISUAL_TRAITS)[number];
export type GeneSlot = { name: string | number; raw: number };
export type TraitGenes = { dominant: GeneSlot; r1: GeneSlot; r2: GeneSlot; r3: GeneSlot };
export type TranslatedGenes = {
	stat: Record<StatTrait, TraitGenes>;
	visual: Record<VisualTrait, TraitGenes>;
};

const STAT_MAPPERS: Partial<Record<StatTrait, [Record<number, string>, string]>> = {
	mainClass: [CLASS_NAMES, "class"], subClass: [CLASS_NAMES, "class"],
	profession: [PROFESSION_NAMES, "profession"],
	passive1: [PASSIVE_NAMES, "passive"], passive2: [PASSIVE_NAMES, "passive"],
	active1: [ACTIVE_NAMES, "active"], active2: [ACTIVE_NAMES, "active"],
	statBoost1: [STAT_BOOST_NAMES, "boost"], statBoost2: [STAT_BOOST_NAMES, "boost"],
	crafting1: [CRAFTING_NAMES, "crafting"], crafting2: [CRAFTING_NAMES, "crafting"],
	element: [ELEMENT_NAMES, "element"],
};
const VISUAL_MAPPERS: Partial<Record<VisualTrait, [Record<number, string>, string]>> = {
	gender: [GENDER_NAMES, "gender"],
	background: [BACKGROUND_NAMES, "bg"],
};

function mapTrait(
	mappers: Partial<Record<string, [Record<number, string>, string]>>,
	trait: string,
	raw: number
): string | number {
	const m = mappers[trait];
	if (!m) return raw; // style and color traits stay numeric
	return m[0][raw] ?? `${m[1]}${raw}`;
}

// The kai string is just the base-32 digits of the gene integer, so extract the digits numerically: 48 digits, 12 trait groups of 4.
function base32Digits(genes: bigint): number[] {
	const digits: number[] = [];
	while (genes > 0n) {
		digits.unshift(Number(genes % 32n));
		genes /= 32n;
	}
	while (digits.length < 48) digits.unshift(0);
	return digits;
}

function traitGroups(genes: bigint): { r3: number; r2: number; r1: number; dominant: number }[] {
	const d = base32Digits(genes);
	return Array.from({ length: 12 }, (_, t) => ({
		r3: d[t * 4], r2: d[t * 4 + 1], r1: d[t * 4 + 2], dominant: d[t * 4 + 3],
	}));
}

const toBigInt = (genes: string | bigint | { toString(): string }): bigint =>
	typeof genes === "bigint" ? genes : BigInt(genes.toString());

export function translateGenes(
	statGenes: string | bigint | { toString(): string },
	visualGenes: string | bigint | { toString(): string }
): TranslatedGenes {
	const build = <T extends string>(
		genes: bigint,
		traits: readonly T[],
		mappers: Partial<Record<string, [Record<number, string>, string]>>
	): Record<T, TraitGenes> => {
		const groups = traitGroups(genes);
		const out = {} as Record<T, TraitGenes>;
		traits.forEach((trait, i) => {
			const slot = (raw: number): GeneSlot => ({ name: mapTrait(mappers, trait, raw), raw });
			out[trait] = {
				dominant: slot(groups[i].dominant),
				r1: slot(groups[i].r1),
				r2: slot(groups[i].r2),
				r3: slot(groups[i].r3),
			};
		});
		return out;
	};
	return {
		stat: build(toBigInt(statGenes), STAT_TRAITS, STAT_MAPPERS),
		visual: build(toBigInt(visualGenes), VISUAL_TRAITS, VISUAL_MAPPERS),
	};
}
