import { describe, it, expect } from "vitest";
import { isActivateKey } from "../../src/components/Heroes/HeroCard/cardKeys";

// The flip toggle and the hero-id copy control were click-only divs, unreachable
// by keyboard users. These anchors guard the Enter/Space activation predicate
// that now backs their onKeyDown handlers, mirroring native <button> activation.
describe("isActivateKey", () => {
	it("activates on Enter", () => {
		expect(isActivateKey("Enter")).toBe(true);
	});

	it("activates on Space", () => {
		expect(isActivateKey(" ")).toBe(true);
	});

	it("ignores keys that do not activate a button", () => {
		expect(isActivateKey("Tab")).toBe(false);
		expect(isActivateKey("a")).toBe(false);
		expect(isActivateKey("Escape")).toBe(false);
		expect(isActivateKey("ArrowRight")).toBe(false);
		// Guard against loose matching: trailing space and the legacy IE key name
		// must not count as activation.
		expect(isActivateKey("Enter ")).toBe(false);
		expect(isActivateKey("Spacebar")).toBe(false);
	});
});
