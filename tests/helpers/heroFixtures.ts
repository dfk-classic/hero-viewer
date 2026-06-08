import buildHero from "../../src/components/Heroes/HeroInfo/utils/heroes";
import type { RawNestedHero } from "../../src/components/Heroes/HeroInfo/utils/heroes";
import type { Hero } from "../../src/types/hero";
import { ZERO_ADDRESS } from "../../src/constants";

// Encode a hero gene string from a sparse {traitIndex: dominantCode} map. convertGenes reads the dominant nibble of each 4-kai trait group, which is the last char of the group (kai index i*4+3). In the 48-char base-32 (kai) string that is place value 32^(44 - 4*i), so each trait's dominant code lands there and every other nibble stays 0.
export function encodeGenes(dominant: Record<number, number>): bigint {
	let genes = 0n;
	for (const [index, code] of Object.entries(dominant)) {
		genes += BigInt(code) * 32n ** BigInt(44 - 4 * Number(index));
	}
	return genes;
}

export function genesToBigNumber(dominant: Record<number, number>): bigint {
	return encodeGenes(dominant);
}

const zeroStatBlock = {
	strength: 0,
	intelligence: 0,
	wisdom: 0,
	luck: 0,
	agility: 0,
	vitality: 0,
	endurance: 0,
	dexterity: 0,
};

export interface RawHeroOptions {
	id?: bigint | string | number;
	visualGenes?: bigint;
	statGenes?: bigint;
	rarity?: string | number;
	xp?: bigint | string | number;
	level?: number;
	staminaFullAt?: bigint | string | number;
	currentQuest?: string;
	stamina?: number;
	startingPrice?: bigint | string | number;
	endingPrice?: bigint | string | number;
	summons?: number;
	maxSummons?: number;
	shiny?: boolean;
	shinyStyle?: number;
	firstName?: number;
	lastName?: number;
}

// Raw hero id/xp/staminaFullAt arrive on-chain as bigint or string; let tests pass plain numbers for readability and coerce them to bigint so the raw hero keeps its real on-chain shape.
function toRaw(value: bigint | string | number): bigint | string {
	return typeof value === "number" ? BigInt(value) : value;
}

// Build a complete on-chain-shaped raw hero. Defaults decode to a male/forest knight so the gene path is exercised with valid lookups; every field a test cares about is overridable.
export function makeRawHero(options: RawHeroOptions = {}): RawNestedHero {
	return {
		id: options.id !== undefined ? toRaw(options.id) : BigInt(1),
		info: {
			visualGenes: options.visualGenes ?? genesToBigNumber({ 0: 1, 3: 2 }),
			statGenes: options.statGenes ?? genesToBigNumber({ 0: 1 }),
			generation: 0,
			rarity: options.rarity ?? 0,
			shiny: options.shiny ?? false,
			shinyStyle: options.shinyStyle ?? 0,
			firstName: options.firstName ?? 0,
			lastName: options.lastName ?? 0,
		},
		state: {
			xp: options.xp !== undefined ? toRaw(options.xp) : BigInt(0),
			staminaFullAt: options.staminaFullAt !== undefined ? toRaw(options.staminaFullAt) : BigInt(0),
			level: options.level ?? 1,
			currentQuest: options.currentQuest ?? ZERO_ADDRESS,
		},
		summoningInfo: {
			summonedTime: BigInt(0),
			nextSummonTime: BigInt(0),
			summonerId: 0,
			assistantId: 0,
			summons: options.summons ?? 0,
			maxSummons: options.maxSummons ?? 10,
		},
		stats: { ...zeroStatBlock, hp: 0, mp: 0, stamina: options.stamina ?? 25 },
		primaryStatGrowth: { ...zeroStatBlock },
		secondaryStatGrowth: { ...zeroStatBlock },
		professions: { mining: 0, gardening: 0, fishing: 0, foraging: 0 },
		startingPrice: options.startingPrice,
		endingPrice: options.endingPrice,
	};
}

export function makeHero(options: RawHeroOptions = {}): Hero {
	const hero: Hero = buildHero(makeRawHero(options));
	return hero;
}
