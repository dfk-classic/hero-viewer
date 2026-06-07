import { describe, it, expect } from "vitest";
import { resolveTabKey } from "../../src/components/Heroes/HeroCardTabs/tabKeys";

// The tab bar is keyboard-operable via the WAI-ARIA tabs pattern. Before this
// helper existed the tabs were click-only divs, unreachable by keyboard users;
// these anchors guard the key -> target-index mapping that restores that access.
describe("resolveTabKey", () => {
	it("advances to the next tab on ArrowRight/ArrowDown and selects it", () => {
		expect(resolveTabKey("ArrowRight", 0, 5)).toEqual({ index: 1, activate: true });
		expect(resolveTabKey("ArrowDown", 2, 5)).toEqual({ index: 3, activate: true });
	});

	it("wraps from the last tab back to the first on a forward key", () => {
		expect(resolveTabKey("ArrowRight", 4, 5)).toEqual({ index: 0, activate: true });
	});

	it("moves to the previous tab on ArrowLeft/ArrowUp", () => {
		expect(resolveTabKey("ArrowLeft", 3, 5)).toEqual({ index: 2, activate: true });
		expect(resolveTabKey("ArrowUp", 1, 5)).toEqual({ index: 0, activate: true });
	});

	it("wraps from the first tab to the last on a backward key", () => {
		expect(resolveTabKey("ArrowLeft", 0, 5)).toEqual({ index: 4, activate: true });
	});

	it("jumps to the ends on Home and End", () => {
		expect(resolveTabKey("Home", 3, 5)).toEqual({ index: 0, activate: true });
		expect(resolveTabKey("End", 1, 5)).toEqual({ index: 4, activate: true });
	});

	it("re-activates the focused tab on Enter and Space", () => {
		expect(resolveTabKey("Enter", 2, 5)).toEqual({ index: 2, activate: true });
		expect(resolveTabKey(" ", 2, 5)).toEqual({ index: 2, activate: true });
	});

	it("ignores keys the tab bar does not own", () => {
		expect(resolveTabKey("Tab", 1, 5)).toBeNull();
		expect(resolveTabKey("a", 1, 5)).toBeNull();
		expect(resolveTabKey("Escape", 1, 5)).toBeNull();
	});

	it("returns null when there are no tabs to move between", () => {
		expect(resolveTabKey("ArrowRight", 0, 0)).toBeNull();
	});
});
