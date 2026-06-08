import { formatEther } from "ethers";
import { DateTime } from "luxon";
import { getFullName, getFirstName, getLastName } from "./names.js";
import { translateGenes } from "./geneTranslator";
import { ZERO_ADDRESS } from "../../../../constants";
import type { Hero } from "../../../../types/hero";

// Raw payloads deliver numeric fields as bigint (on-chain getHero, where every integer width decodes to bigint under ethers v6) or as decimal strings/numbers (subgraph); coerce any of them to a JS number so the built hero stays uniformly numeric regardless of source.
const num = (value: bigint | number | string): number => Number(value);

const choices: { [index: string]: { [code: number]: string | number } } = {
	gender: { 1: "male", 3: "female" },
	background: {
		0: "desert",
		2: "forest",
		4: "plains",
		6: "island",
		8: "swamp",
		10: "mountains",
		12: "city",
		14: "arctic",
	},
	class: {
		0: "warrior",
		1: "knight",
		2: "thief",
		3: "archer",
		4: "priest",
		5: "wizard",
		6: "monk",
		7: "pirate",
		8: "berserker",
		9: "seer",
		10: "legionnaire",
		11: "scholar",
		16: "paladin",
		17: "darkKnight",
		18: "summoner",
		19: "ninja",
		20: "shapeshifter",
		21: "bard",
		24: "dragoon",
		25: "sage",
		26: "spellbow",
		28: "dreadKnight",
	},
	skinColor: {
		0: "c58135",
		2: "f1ca9e",
		4: "985e1c",
		6: "57340c",
		8: "e6a861",
		10: "7b4a11",
		12: "e5ac91",
		14: "aa5c38",
		16: "7db44f",
		18: "7786b8",
		20: "d8d4d8",
		22: "e03f3f",
		24: "6a3671",
	},
	hairColor: {
		0: "ab9159",
		1: "af3853",
		2: "578761",
		3: "068483",
		4: "48321e",
		5: "66489e",
		6: "ca93a7",
		7: "62a7e6",
		8: "c34b1e",
		9: "326988",
		10: "513f4f",
		11: "d48b41",
		16: "d7bc65",
		17: "9b68ab",
		18: "8d6b3a",
		19: "566377",
		20: "275435",
		21: "77b23c",
		24: "880016",
		25: "353132",
		26: "dbfbf5",
		28: "8f9bb3",
	},
	eyeColor: {
		0: "203997",
		2: "896693",
		4: "bb3f55",
		6: "0d7634",
		8: "8d7136",
		10: "613d8a",
		12: "2494a2",
		14: "a41e12",
	},
	appendageColor: {
		0: "c5bfa7",
		1: "a88b47",
		2: "58381e",
		3: "566f7d",
		4: "2a386d",
		5: "3f2e40",
		6: "830e18",
		7: "6f3a3c",
		8: "cddef0",
		9: "df7126",
		10: "835138",
		11: "86a637",
		16: "6b173c",
		17: "a0304d",
		18: "78547c",
		19: "352a51",
		20: "147256",
		21: "cf7794",
		24: "c29d35",
		25: "211f1f",
		26: "77b5cf",
		28: "d7d7d7",
	},
	backAppendageColor: {
		0: "c5bfa7",
		1: "a88b47",
		2: "58381e",
		3: "566f7d",
		4: "2a386d",
		5: "3f2e40",
		6: "830e18",
		7: "6f3a3c",
		8: "cddef0",
		9: "df7126",
		10: "835138",
		11: "86a637",
		16: "6b173c",
		17: "a0304d",
		18: "78547c",
		19: "352a51",
		20: "147256",
		21: "cf7794",
		24: "c29d35",
		25: "211f1f",
		26: "77b5cf",
		28: "d7d7d7",
	},
	hairStyle: {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		10: 10,
		11: 11,
		16: 16,
		17: 17,
		18: 18,
		19: 19,
		20: 20,
		21: 21,
		24: 24,
		25: 25,
		26: 26,
		28: 28,
	},
	backAppendage: {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		10: 10,
		11: 11,
		16: 16,
		17: 17,
		18: 18,
		19: 19,
		20: 20,
		21: 21,
		24: 24,
		25: 25,
		26: 26,
		28: 28,
	},
	headAppendage: {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		10: 10,
		11: 11,
		16: 16,
		17: 17,
		18: 18,
		19: 19,
		20: 20,
		21: 21,
		24: 24,
		25: 25,
		26: 26,
		28: 28,
	},
	subClass: {
		0: "warrior",
		1: "knight",
		2: "thief",
		3: "archer",
		4: "priest",
		5: "wizard",
		6: "monk",
		7: "pirate",
		8: "berserker",
		9: "seer",
		10: "legionnaire",
		11: "scholar",
		16: "paladin",
		17: "darkKnight",
		18: "summoner",
		19: "ninja",
		20: "shapeshifter",
		21: "bard",
		24: "dragoon",
		25: "sage",
		26: "spellbow",
		28: "dreadKnight",
	},
	profession: {
		0: "mining",
		2: "gardening",
		4: "fishing",
		6: "foraging",
	},
	passive1: {
		0: "Basic1",
		1: "Basic2",
		2: "Basic3",
		3: "Basic4",
		4: "Basic5",
		5: "Basic6",
		6: "Basic7",
		7: "Basic8",
		16: "Advanced1",
		17: "Advanced2",
		18: "Advanced3",
		19: "Advanced4",
		24: "Elite1",
		25: "Elite2",
		28: "Exalted1",
	},
	passive2: {
		0: "Basic1",
		1: "Basic2",
		2: "Basic3",
		3: "Basic4",
		4: "Basic5",
		5: "Basic6",
		6: "Basic7",
		7: "Basic8",
		16: "Advanced1",
		17: "Advanced2",
		18: "Advanced3",
		19: "Advanced4",
		24: "Elite1",
		25: "Elite2",
		28: "Exalted1",
	},
	active1: {
		0: "Basic1",
		1: "Basic2",
		2: "Basic3",
		3: "Basic4",
		4: "Basic5",
		5: "Basic6",
		6: "Basic7",
		7: "Basic8",
		16: "Advanced1",
		17: "Advanced2",
		18: "Advanced3",
		19: "Advanced4",
		24: "Elite1",
		25: "Elite2",
		28: "Exalted1",
	},
	active2: {
		0: "Basic1",
		1: "Basic2",
		2: "Basic3",
		3: "Basic4",
		4: "Basic5",
		5: "Basic6",
		6: "Basic7",
		7: "Basic8",
		16: "Advanced1",
		17: "Advanced2",
		18: "Advanced3",
		19: "Advanced4",
		24: "Elite1",
		25: "Elite2",
		28: "Exalted1",
	},
	statBoost1: {
		0: "STR",
		2: "AGI",
		4: "INT",
		6: "WIS",
		8: "LCK",
		10: "VIT",
		12: "END",
		14: "DEX",
	},
	statBoost2: {
		0: "STR",
		2: "AGI",
		4: "INT",
		6: "WIS",
		8: "LCK",
		10: "VIT",
		12: "END",
		14: "DEX",
	},
	element: {
		0: "fire",
		2: "water",
		4: "earth",
		6: "wind",
		8: "lightning",
		10: "ice",
		12: "light",
		14: "dark",
	},
	visualUnknown1: {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		16: 16,
		17: 17,
		18: 18,
		19: 19,
		24: 24,
		25: 25,
		28: 28,
	},
	visualUnknown2: {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		16: 16,
		17: 17,
		18: 18,
		19: 19,
		24: 24,
		25: 25,
		28: 28,
	},
	statsUnknown1: {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		16: 16,
		17: 17,
		18: 18,
		19: 19,
		24: 24,
		25: 25,
		28: 28,
	},
	statsUnknown2: {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		16: 16,
		17: 17,
		18: 18,
		19: 19,
		24: 24,
		25: 25,
		28: 28,
	},
};

// To do this, we need to map each section of the gene string to a key.
export const visualGenesMap: { [index: number]: string } = {
	0: "gender",
	1: "headAppendage",
	2: "backAppendage",
	3: "background",
	4: "hairStyle",
	5: "hairColor",
	6: "visualUnknown1",
	7: "eyeColor",
	8: "skinColor",
	9: "appendageColor",
	10: "backAppendageColor",
	11: "visualUnknown2",
};

const statsGenesMap: { [index: number]: string } = {
	0: "class",
	1: "subClass",
	2: "profession",
	3: "passive1",
	4: "passive2",
	5: "active1",
	6: "active2",
	7: "statBoost1",
	8: "statBoost2",
	9: "statsUnknown1",
	10: "element",
	11: "statsUnknown2",
};

// Base-32 "kai" alphabet used to encode gene strings: index 0 is "1", 31 is "x" (the letters l and v are skipped). Shared by kai2dec and genesToKai so the two directions of the conversion can never drift out of sync.
const KAI_ALPHABET = "123456789abcdefghijkmnopqrstuvwx";

function kai2dec(kai: string): number {
	return KAI_ALPHABET.indexOf(kai);
}

function genesToKai(genes: bigint): string {
	const BASE = BigInt(KAI_ALPHABET.length);

	let buf = "";
	while (genes >= BASE) {
		const mod = genes % BASE;
		buf = KAI_ALPHABET[Number(mod)] + buf;
		genes = (genes - mod) / BASE;
	}

	// Add the last 4 (finally).
	buf = KAI_ALPHABET[Number(genes)] + buf;

	// Pad with leading 0s.
	buf = buf.padStart(48, "1");

	return buf.replace(/(.{4})/g, "$1 ");
}

export function convertGenes(
	_genes: bigint,
	genesMap: { [index: number]: string }
): { [index: string]: string | number } {
	// First, convert the genes to kai, then drop the grouping spaces.
	const rawKai = genesToKai(_genes).split(" ").join("");

	const genes: { [index: string]: string | number } = {};

	// Each trait owns a 4-kai group. Walk every character and let later ones overwrite earlier ones, so the dominant nibble — the 4th, highest place-value char of the group — is what survives for each trait.
	for (let i = 0; i < rawKai.length; i++) {
		const trait = genesMap[Math.floor(i / 4)];
		genes[trait] = choices[trait][kai2dec(rawKai[i])];
	}

	return genes;
}

export const calculateRequiredXp = (level: number): number => {
	let xpNeeded: number;
	const nextLevel = level + 1;
	switch (true) {
		case level < 6:
			xpNeeded = nextLevel * 1000;
			break;
		case level < 9:
			xpNeeded = 4000 + (nextLevel - 5) * 2000;
			break;
		case level < 16:
			xpNeeded = 12000 + (nextLevel - 9) * 4000;
			break;
		case level < 36:
			xpNeeded = 40000 + (nextLevel - 16) * 5000;
			break;
		case level < 56:
			xpNeeded = 140000 + (nextLevel - 36) * 7500;
			break;
		case level >= 56:
			xpNeeded = 290000 + (nextLevel - 56) * 10000;
			break;
		default:
			xpNeeded = 0;
			break;
	}

	return xpNeeded;
};

export const RARITY_COMMON = "common";
export const RARITY_UNCOMMON = "uncommon";
export const RARITY_RARE = "rare";
export const RARITY_LEGENDARY = "legendary";
export const RARITY_MYTHIC = "mythic";
export const RARITY_COLORS: Record<string, string> = {
	[RARITY_COMMON]: "#FFFFFF",
	[RARITY_UNCOMMON]: "#14C25A",
	[RARITY_RARE]: "#21CCFF",
	[RARITY_LEGENDARY]: "#ffa32d",
	[RARITY_MYTHIC]: "#df5bff",
};
export const RARITY_LEVELS = [
	RARITY_COMMON,
	RARITY_UNCOMMON,
	RARITY_RARE,
	RARITY_LEGENDARY,
	RARITY_MYTHIC,
];

interface RawOwner {
	id?: string;
	name?: string;
	_name?: string;
	owner?: string;
	_owner?: string;
	picId?: string | number | null;
	_picId?: string | number | null;
}

interface RawStatBlock {
	strength: number | bigint;
	intelligence: number | bigint;
	wisdom: number | bigint;
	luck: number | bigint;
	agility: number | bigint;
	vitality: number | bigint;
	endurance: number | bigint;
	dexterity: number | bigint;
}

export interface RawNestedHero {
	id: bigint | string;
	info: {
		visualGenes: bigint;
		statGenes: bigint;
		generation: number | bigint;
		rarity: string | number | bigint;
		shiny: boolean;
		shinyStyle: number | bigint;
		firstName?: string | number | bigint;
		lastName?: string | number | bigint;
	};
	state: {
		xp: bigint | string;
		staminaFullAt: bigint | string;
		level: number | bigint;
		currentQuest: string;
	};
	summoningInfo: {
		summonedTime: bigint | string;
		nextSummonTime: bigint | string;
		summonerId: number | bigint;
		assistantId: number | bigint;
		summons: number | bigint;
		maxSummons: number | bigint;
	};
	stats: RawStatBlock & { hp: number | bigint; mp: number | bigint; stamina: number | bigint };
	primaryStatGrowth: RawStatBlock;
	secondaryStatGrowth: RawStatBlock;
	professions: { mining: number | bigint; gardening: number | bigint; fishing: number | bigint; foraging: number | bigint };
	salePrice?: bigint | string | number;
	summoningPrice?: bigint | string | number;
	startingPrice?: bigint | string | number;
	endingPrice?: bigint | string | number;
	startedAt?: number;
	duration?: number;
	winner?: string | null;
}

/** Returns a hero object the way the game likes it. */
export default function buildHero(heroRaw: RawNestedHero, owner?: RawOwner): Hero {
	const visualGenes = convertGenes(heroRaw.info.visualGenes, visualGenesMap);
	const statGenes = convertGenes(heroRaw.info.statGenes, statsGenesMap);

	if (!owner) {
		owner = {
			id: "",
			name: "N/A",
			picId: null,
		};
	}

	// Subgraph delivers rarity as its lowercase tier name; map it to the numeric enum index the on-chain payload already provides. Every other numeric field (id, xp, timestamps) is coerced to a number at read time by num(), so no upfront normalisation is needed.
	if (typeof heroRaw.id === "string") {
		heroRaw.info.rarity = RARITY_LEVELS.indexOf(
			(heroRaw.info.rarity as string).toLowerCase()
		);
	}

	return {
		owner: {
			name: owner.name || owner._name || "",
			owner: owner.owner || owner._owner || owner.id || "",
		},
		// choices.background maps only even codes; choices.class and choices.subClass have gaps at 12-15, 22-23, 27, 29-31 — normalise missing entries to the empty-string sentinel so these fields stay guaranteed strings on the built hero.
		background: (visualGenes.background as string | undefined) ?? "",
		class: (statGenes.class as string | undefined) ?? "",
		subClass: (statGenes.subClass as string | undefined) ?? "",
		classType: "basic",
		// choices.element maps only even codes 0,2,4,6,8,10,12,14; any odd nibble decodes to undefined — normalise to the empty-string sentinel so element stays a guaranteed string on the built hero.
		element: (statGenes.element as string | undefined) ?? "",
		// choices.gender only maps codes 1 and 3; any other nibble decodes to undefined — normalise to the empty-string sentinel so gender stays a guaranteed string on the built hero, matching the same coercion applied to firstName below.
		gender: (visualGenes.gender as string | undefined) ?? "",
		generation: num(heroRaw.info.generation),
		id: num(heroRaw.id),
		heroId: num(heroRaw.id),
		summonerId: num(heroRaw.summoningInfo.summonerId),
		assistantId: num(heroRaw.summoningInfo.assistantId),
		currentQuest: heroRaw.state.currentQuest,
		isQuesting: heroRaw.state.currentQuest !== ZERO_ADDRESS,
		level: num(heroRaw.state.level),
		xp: num(heroRaw.state.xp),
		// getFirstName falls through to undefined for any gender other than male/female; normalise to the empty-string sentinel here, the same way owner.name is coerced above, so firstName stays a guaranteed string on the built hero.
		firstName: getFirstName(visualGenes.gender, heroRaw.info.firstName) ?? "",
		lastName: getLastName(heroRaw.info.lastName),
		name: getFullName(
			visualGenes.gender,
			heroRaw.info.firstName,
			heroRaw.info.lastName
		),
		rarity: RARITY_LEVELS[num(heroRaw.info.rarity)],
		rarityNum: num(heroRaw.info.rarity),
		shiny: heroRaw.info.shiny,
		shinyStyle: heroRaw.info.shiny ? num(heroRaw.info.shinyStyle) : 0,
		currentStamina: num(heroRaw.stats.stamina),
		staminaFullAt: DateTime.fromSeconds(num(heroRaw.state.staminaFullAt)),
		summonedDate: DateTime.fromSeconds(
			num(heroRaw.summoningInfo.summonedTime)
		),
		nextSummonTime: DateTime.fromSeconds(
			num(heroRaw.summoningInfo.nextSummonTime)
		),
		summons: num(heroRaw.summoningInfo.summons),
		maxSummons: num(heroRaw.summoningInfo.maxSummons),
		summonsRemaining:
			num(heroRaw.summoningInfo.maxSummons) < 11
				? num(heroRaw.summoningInfo.maxSummons) - num(heroRaw.summoningInfo.summons)
				: 11,
		price: heroRaw.salePrice
			? parseFloat(formatEther(heroRaw.salePrice))
			: 0,
		summoningPrice: heroRaw.summoningPrice
			? parseFloat(formatEther(heroRaw.summoningPrice))
			: 0,
		pjstatus: null,
		pjlevel: null,
		winner: heroRaw.winner ? heroRaw.winner : null,
		auction: {
			onAuction: heroRaw.startingPrice !== heroRaw.endingPrice ? true : false,
			startingPrice: heroRaw.startingPrice
				? parseFloat(formatEther(heroRaw.startingPrice))
				: 0,
			endingPrice: heroRaw.endingPrice
				? parseFloat(formatEther(heroRaw.endingPrice))
				: 0,
			startedAt: heroRaw.startedAt ?? 0,
			duration: heroRaw.duration ?? 0,
		},
		stats: {
			strength: num(heroRaw.stats.strength),
			intelligence: num(heroRaw.stats.intelligence),
			wisdom: num(heroRaw.stats.wisdom),
			luck: num(heroRaw.stats.luck),
			agility: num(heroRaw.stats.agility),
			vitality: num(heroRaw.stats.vitality),
			endurance: num(heroRaw.stats.endurance),
			dexterity: num(heroRaw.stats.dexterity),
			hp: num(heroRaw.stats.hp),
			mp: num(heroRaw.stats.mp),
			stamina: num(heroRaw.stats.stamina),
		},
		visualGenes: visualGenes,
		visual: {
			...visualGenes,
			shiny: heroRaw.info.shiny,
			shinyStyle: heroRaw.info.shiny ? num(heroRaw.info.shinyStyle) : 0,
		},
		statGrowth: {
			primary: {
				strength: num(heroRaw.primaryStatGrowth.strength),
				intelligence: num(heroRaw.primaryStatGrowth.intelligence),
				wisdom: num(heroRaw.primaryStatGrowth.wisdom),
				luck: num(heroRaw.primaryStatGrowth.luck),
				agility: num(heroRaw.primaryStatGrowth.agility),
				vitality: num(heroRaw.primaryStatGrowth.vitality),
				endurance: num(heroRaw.primaryStatGrowth.endurance),
				dexterity: num(heroRaw.primaryStatGrowth.dexterity),
			},
			secondary: {
				strength: num(heroRaw.secondaryStatGrowth.strength),
				intelligence: num(heroRaw.secondaryStatGrowth.intelligence),
				wisdom: num(heroRaw.secondaryStatGrowth.wisdom),
				luck: num(heroRaw.secondaryStatGrowth.luck),
				agility: num(heroRaw.secondaryStatGrowth.agility),
				vitality: num(heroRaw.secondaryStatGrowth.vitality),
				endurance: num(heroRaw.secondaryStatGrowth.endurance),
				dexterity: num(heroRaw.secondaryStatGrowth.dexterity),
			},
		},
		statGenes: statGenes,
		// Full translation of both gene strings: every trait, dominant + r1/r2/r3, named the same way HONK and the transcended-roster dataset name them.
		genes: translateGenes(heroRaw.info.statGenes, heroRaw.info.visualGenes),
		skills: {
			mining: num(heroRaw.professions.mining) / 10,
			gardening: num(heroRaw.professions.gardening) / 10,
			fishing: num(heroRaw.professions.fishing) / 10,
			foraging: num(heroRaw.professions.foraging) / 10,
		},
	};
}
