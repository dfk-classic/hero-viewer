import type { DateTime } from "luxon";
import type { TranslatedGenes } from "../components/Heroes/HeroInfo/utils/geneTranslator";

// Canonical hero shape produced by buildHero (HeroInfo/utils/heroes.ts) and consumed across the card, profile, stats, gene and SVG render layers. Fields mirror the builder's return literal one-for-one; collections that callers index by a dynamic key carry a string index signature so lookups like stats[stat.value] stay typed.

export interface HeroOwner {
	name: string;
	owner: string;
}

export interface HeroAuction {
	onAuction: boolean;
	startingPrice: number;
	endingPrice: number;
	startedAt: number;
	duration: number;
}

// Core combat stats plus hp/mp/stamina; indexed by name for stats[stat.value] lookups.
export interface HeroStats {
	strength: number;
	intelligence: number;
	wisdom: number;
	luck: number;
	agility: number;
	vitality: number;
	endurance: number;
	dexterity: number;
	hp: number;
	mp: number;
	stamina: number;
	[stat: string]: number;
}

// Per-stat growth percentages; indexed for statGrowth[position][stat.value] lookups.
export interface HeroStatGrowthBlock {
	strength: number;
	intelligence: number;
	wisdom: number;
	luck: number;
	agility: number;
	vitality: number;
	endurance: number;
	dexterity: number;
	[stat: string]: number;
}

export interface HeroStatGrowth {
	primary: HeroStatGrowthBlock;
	secondary: HeroStatGrowthBlock;
	[position: string]: HeroStatGrowthBlock;
}

export interface HeroSkills {
	mining: number;
	gardening: number;
	fishing: number;
	foraging: number;
	[skill: string]: number;
}

// convertGenes output: display and raw gene values keyed by trait, mixed string/number.
export interface HeroGeneValues {
	[trait: string]: string | number;
}

// buildHero's `visual`: the visual gene values spread together with the shiny flags.
export interface HeroVisual {
	shiny: boolean;
	shinyStyle: number;
	[trait: string]: string | number | boolean;
}

// Full translated gene tree (stat + visual, dominant + r1/r2/r3 per trait) reused verbatim from translateGenes so the builder's output matches field-for-field.
export interface Hero {
	id: number;
	heroId: number;
	owner: HeroOwner;
	name?: string;

	generation: number;
	level: number;
	xp: number;
	rarity: string;
	rarityNum: number;
	shiny: boolean;
	shinyStyle: number;
	class: string;
	subClass: string;
	classType: string;
	background: string;
	element: string;
	gender: string;

	currentStamina: number;
	summons: number;
	maxSummons: number;
	summonsRemaining: number;
	price: number;
	winner: string | null;

	pjstatus: string | null;
	pjlevel: number | null;

	auction: HeroAuction;
	stats: HeroStats;
	statGrowth: HeroStatGrowth;
	skills: HeroSkills;

	visualGenes: HeroGeneValues;
	statGenes: HeroGeneValues;
	visual: HeroVisual;
	genes: TranslatedGenes;

	staminaFullAt: DateTime;
	summonedDate: DateTime;
	nextSummonTime: DateTime;
}

export default Hero;
