import { describe, it, expect } from "vitest";
import {
	getFirstName,
	getLastName,
	getFullName,
} from "../../src/components/Heroes/HeroInfo/utils/names.js";

// The name tables are fixed, append-only data files, so a handful of known
// index -> value anchors pin the lookup behaviour without depending on the full
// list. maleFirstNames[0]="Dernere", femaleFirstNames[0]="Alexandria",
// lastNames[0]="Ironsteam" are the first entries of each array.
describe("getFirstName", () => {
	it("returns the male first name at the given index", () => {
		expect(getFirstName("male", 0)).toBe("Dernere");
		expect(getFirstName("male", 2)).toBe("Fréabald");
	});

	it("returns the female first name at the given index", () => {
		expect(getFirstName("female", 0)).toBe("Alexandria");
		expect(getFirstName("female", 1)).toBe("Romy");
	});

	it("returns undefined for an unrecognised gender", () => {
		expect(getFirstName("other", 0)).toBeUndefined();
	});
});

describe("getLastName", () => {
	it("returns the surname at the given index regardless of gender", () => {
		expect(getLastName(0)).toBe("Ironsteam");
		expect(getLastName(1)).toBe("Boneglide");
	});
});

describe("getFullName", () => {
	it("joins the male first name and surname with a single space", () => {
		expect(getFullName("male", 0, 0)).toBe("Dernere Ironsteam");
	});

	it("joins the female first name and surname with a single space", () => {
		expect(getFullName("female", 1, 1)).toBe("Romy Boneglide");
	});

	it("returns undefined for an unrecognised gender", () => {
		expect(getFullName("other", 0, 0)).toBeUndefined();
	});
});
