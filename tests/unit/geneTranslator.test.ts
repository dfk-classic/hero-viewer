import { describe, it, expect } from "vitest";
import { translateGenes } from "../../src/components/Heroes/HeroInfo/utils/geneTranslator";

// Pack one trait's four kai slots into the full 48-digit base-32 gene integer.
// Trait t occupies digits [t*4 .. t*4+3] counted from the most significant end;
// the dominant slot sits at place value 32^(44 - 4t) and the recessives r1/r2/r3
// climb one place each above it. Summing per-trait packs builds a whole gene.
const encodeTrait = (
	traitIndex: number,
	slots: { dominant: number; r1?: number; r2?: number; r3?: number },
): bigint => {
	const { dominant, r1 = 0, r2 = 0, r3 = 0 } = slots;
	const base = BigInt(44 - 4 * traitIndex);
	return (
		BigInt(dominant) * 32n ** base +
		BigInt(r1) * 32n ** (base + 1n) +
		BigInt(r2) * 32n ** (base + 2n) +
		BigInt(r3) * 32n ** (base + 3n)
	);
};

const NO_GENES = 0n;

describe("translateGenes", () => {
	it("decodes every class slot of mainClass to its display name", () => {
		// mainClass is stat trait 0; dominant 18 -> Summoner with knight/thief/warrior recessives.
		const statGenes = encodeTrait(0, { dominant: 18, r1: 1, r2: 2, r3: 0 });
		const { stat } = translateGenes(statGenes, NO_GENES);
		expect(stat.mainClass.dominant.name).toBe("Summoner");
		expect(stat.mainClass.r1.name).toBe("Knight");
		expect(stat.mainClass.r2.name).toBe("Thief");
		expect(stat.mainClass.r3.name).toBe("Warrior");
	});

	it("preserves the raw code alongside the decoded name on each slot", () => {
		const statGenes = encodeTrait(0, { dominant: 18, r1: 1, r2: 2, r3: 0 });
		const { stat } = translateGenes(statGenes, NO_GENES);
		expect(stat.mainClass.dominant.raw).toBe(18);
		expect(stat.mainClass.r1.raw).toBe(1);
		expect(stat.mainClass.r2.raw).toBe(2);
		expect(stat.mainClass.r3.raw).toBe(0);
	});

	it("decodes the element trait at its position in the stat trait order", () => {
		// element is stat trait 10; dominant 14 -> dark.
		const statGenes = encodeTrait(10, { dominant: 14 });
		const { stat } = translateGenes(statGenes, NO_GENES);
		expect(stat.element.dominant.name).toBe("dark");
	});

	it("falls back to a prefixed raw label when a code has no mapped name", () => {
		// 12 is not a class code; element 1 is not a mapped element. Both fall back to
		// "<prefix><raw>" so the card still renders something deterministic.
		const statGenes =
			encodeTrait(0, { dominant: 12 }) + encodeTrait(10, { dominant: 1 });
		const { stat } = translateGenes(statGenes, NO_GENES);
		expect(stat.mainClass.dominant.name).toBe("class12");
		expect(stat.element.dominant.name).toBe("element1");
	});

	it("decodes mapped visual traits and leaves style/colour traits numeric", () => {
		// gender (visual trait 0) dominant 1 -> male, background (trait 3) dominant 2 -> forest,
		// hairColor (trait 5) has no mapper so its raw code passes through unchanged.
		const visualGenes =
			encodeTrait(0, { dominant: 1 }) +
			encodeTrait(3, { dominant: 2 }) +
			encodeTrait(5, { dominant: 9 });
		const { visual } = translateGenes(NO_GENES, visualGenes);
		expect(visual.gender.dominant.name).toBe("male");
		expect(visual.background.dominant.name).toBe("forest");
		expect(visual.hairColor.dominant.name).toBe(9);
	});

	it("accepts the gene integer as a decimal string as well as a bigint", () => {
		const statGenes = encodeTrait(0, { dominant: 18 });
		const fromString = translateGenes(statGenes.toString(), NO_GENES.toString());
		expect(fromString.stat.mainClass.dominant.name).toBe("Summoner");
	});
});
