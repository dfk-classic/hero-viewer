import { describe, it, expect } from "vitest";
import {
	recessiveRows,
	RECESSIVE_COLORS,
} from "../../src/components/Heroes/HeroStatsRecessive/recessiveRows";
import {
	STAT_TRAITS,
	type GeneSlot,
	type StatTrait,
	type TraitGenes,
} from "../../src/components/Heroes/HeroInfo/utils/geneTranslator";

const slot = (name: string | number): GeneSlot => ({ name, raw: 0 });

// Build a full stat record where every slot's name encodes its own trait and slot, so assertions can prove the builder reads the right cell.
function makeStat(): Record<StatTrait, TraitGenes> {
	const out = {} as Record<StatTrait, TraitGenes>;
	for (const trait of STAT_TRAITS) {
		out[trait] = {
			dominant: slot(`${trait}:dominant`),
			r1: slot(`${trait}:r1`),
			r2: slot(`${trait}:r2`),
			r3: slot(`${trait}:r3`),
		};
	}
	return out;
}

describe("recessiveRows", () => {
	it("emits the seven groups with the documented pair/standalone shape", () => {
		const groups = recessiveRows(makeStat(), "r1");
		expect(groups.map((g) => g.pair)).toEqual([
			true,
			false,
			true,
			false,
			false,
			false,
			false,
		]);
	});

	it("lists the nine rows in card order", () => {
		const flat = recessiveRows(makeStat(), "r1").flatMap((g) => g.rows);
		expect(flat.map((r) => r.label)).toEqual([
			"Class",
			"Subclass",
			"Profession",
			"Stat Boost 1",
			"Stat Boost 2",
			"Active 1",
			"Active 2",
			"Passive 1",
			"Passive 2",
		]);
	});

	it("reads each row's value from its own trait in the requested slot", () => {
		const flat = recessiveRows(makeStat(), "r2").flatMap((g) => g.rows);
		const byLabel = (label: string) =>
			flat.find((r) => r.label === label)?.value;
		expect(byLabel("Class")).toBe("mainClass:r2");
		expect(byLabel("Subclass")).toBe("subClass:r2");
		expect(byLabel("Stat Boost 2")).toBe("statBoost2:r2");
		expect(byLabel("Active 2")).toBe("active2:r2");
		expect(byLabel("Passive 1")).toBe("passive1:r2");
	});

	it("capitalises only the profession value", () => {
		const flat = recessiveRows(makeStat(), "r1").flatMap((g) => g.rows);
		const byLabel = (label: string) =>
			flat.find((r) => r.label === label)?.value;
		// Profession is the one trait the tab title-cases.
		expect(byLabel("Profession")).toBe("Profession:r1");
		// Everything else passes through verbatim — still lowercase.
		expect(byLabel("Class")).toBe("mainClass:r1");
		expect(byLabel("Active 1")).toBe("active1:r1");
	});

	it("colours rows by trait family, sharing one colour across the actives and passives", () => {
		const flat = recessiveRows(makeStat(), "r3").flatMap((g) => g.rows);
		const byLabel = (label: string) =>
			flat.find((r) => r.label === label)?.color;
		expect(byLabel("Class")).toBe(RECESSIVE_COLORS.class);
		expect(byLabel("Profession")).toBe(RECESSIVE_COLORS.profession);
		expect(byLabel("Active 1")).toBe(RECESSIVE_COLORS.active);
		expect(byLabel("Active 2")).toBe(RECESSIVE_COLORS.active);
		expect(byLabel("Passive 1")).toBe(RECESSIVE_COLORS.passive);
		expect(byLabel("Passive 2")).toBe(RECESSIVE_COLORS.passive);
	});
});
