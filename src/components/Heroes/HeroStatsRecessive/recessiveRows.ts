import type { StatTrait, TraitGenes } from "../HeroInfo/utils/geneTranslator";

// The recessive slot keys. "dominant" is excluded — that is the expressed gene the Abilities tab shows.
export type RecessiveSlot = "r1" | "r2" | "r3";

export interface RecessiveRow {
	label: string;
	value: string;
	color: string;
}

export interface RecessiveGroup {
	pair: boolean;
	rows: RecessiveRow[];
}

// Colours keyed by trait family, shared across every recessive slot.
export const RECESSIVE_COLORS = {
	class: "#e6c15a",
	subClass: "#d14f69",
	profession: "#8bc34a",
	statBoost1: "#ff9800",
	statBoost2: "#4caf50",
	active: "#2196f3",
	passive: "#9c27b0",
};

interface RecessiveSpec {
	label: string;
	trait: StatTrait;
	color: string;
	capitalize?: boolean;
}

// Recessive gene layout: Class/Subclass and the two stat boosts render as paired rows; profession, actives and passives stand alone. Trait order follows the documented gene encoding; HONK's own display swaps active1/active2 here, which we intentionally do not copy.
const RECESSIVE_LAYOUT: { pair: boolean; specs: RecessiveSpec[] }[] = [
	{
		pair: true,
		specs: [
			{ label: "Class", trait: "mainClass", color: RECESSIVE_COLORS.class },
			{ label: "Subclass", trait: "subClass", color: RECESSIVE_COLORS.subClass },
		],
	},
	{
		pair: false,
		specs: [
			{
				label: "Profession",
				trait: "profession",
				color: RECESSIVE_COLORS.profession,
				capitalize: true,
			},
		],
	},
	{
		pair: true,
		specs: [
			{ label: "Stat Boost 1", trait: "statBoost1", color: RECESSIVE_COLORS.statBoost1 },
			{ label: "Stat Boost 2", trait: "statBoost2", color: RECESSIVE_COLORS.statBoost2 },
		],
	},
	{ pair: false, specs: [{ label: "Active 1", trait: "active1", color: RECESSIVE_COLORS.active }] },
	{ pair: false, specs: [{ label: "Active 2", trait: "active2", color: RECESSIVE_COLORS.active }] },
	{ pair: false, specs: [{ label: "Passive 1", trait: "passive1", color: RECESSIVE_COLORS.passive }] },
	{ pair: false, specs: [{ label: "Passive 2", trait: "passive2", color: RECESSIVE_COLORS.passive }] },
];

const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

// Resolve every recessive row's display value for one slot, preserving the paired/standalone grouping the tab renders.
export function recessiveRows(
	stat: Record<StatTrait, TraitGenes>,
	slot: RecessiveSlot
): RecessiveGroup[] {
	return RECESSIVE_LAYOUT.map((group) => ({
		pair: group.pair,
		rows: group.specs.map((spec) => {
			const value = String(stat[spec.trait][slot].name);
			return {
				label: spec.label,
				value: spec.capitalize ? cap(value) : value,
				color: spec.color,
			};
		}),
	}));
}
