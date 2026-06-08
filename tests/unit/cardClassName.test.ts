import { describe, it, expect } from "vitest";
import { heroCardClassName } from "../../src/components/Heroes/HeroCard/cardClassName";

// Mirrors how vitest resolves a CSS module under the default css:false — every accessed key returns its own name as the class token — so an asserted token like "animate" is exactly what the real styles.module.css proxy would hand the component.
const identityStyles = new Proxy(
	{},
	{ get: (_target, prop) => String(prop) }
) as Readonly<Record<string, string>>;

const base = {
	styles: identityStyles,
	element: "forest",
	rarity: "Common",
	shiny: false,
	shinyStyle: 0,
	flipped: false,
};

const tokens = (cls: string) => cls.split(" ");

describe("heroCardClassName", () => {
	it("omits the animate class and never emits an undefined token when isAnimated is absent", () => {
		// Regression guard: the class was built with `${isAnimated && styles.animate}`. With isAnimated undefined that expression is undefined, and the surrounding template literal stringified it to the word "undefined", so every card the App rendered without the prop carried a stray `undefined` class.
		const result = tokens(heroCardClassName({ ...base, flipToggle: true }));
		expect(result).not.toContain("undefined");
		expect(result).not.toContain("animate");
	});

	it("omits the animate class and never emits a false token for an explicit isAnimated={false}", () => {
		// The same defect surfaced as a literal "false" class when the prop was passed explicitly false.
		const result = tokens(
			heroCardClassName({ ...base, flipToggle: true, isAnimated: false })
		);
		expect(result).not.toContain("false");
		expect(result).not.toContain("animate");
	});

	it("applies the animate class when isAnimated is true", () => {
		const result = tokens(heroCardClassName({ ...base, isAnimated: true }));
		expect(result).toContain("animate");
	});

	it("always carries the base, element and rarity classes", () => {
		const result = tokens(heroCardClassName(base));
		expect(result).toContain("heroCard");
		expect(result).toContain("forest");
		expect(result).toContain("Common");
	});

	it("adds the shiny and styled-shiny classes only when shiny is set", () => {
		expect(tokens(heroCardClassName(base))).not.toContain("shiny");
		const lit = tokens(
			heroCardClassName({ ...base, shiny: true, shinyStyle: 3 })
		);
		expect(lit).toContain("shiny");
		expect(lit).toContain("shiny3");
	});

	it("toggles the flippable and flipped classes off by default and on when requested", () => {
		expect(tokens(heroCardClassName(base))).not.toContain("flippable");
		expect(tokens(heroCardClassName(base))).not.toContain("flipped");
		const on = tokens(
			heroCardClassName({ ...base, flipToggle: true, flipped: true })
		);
		expect(on).toContain("flippable");
		expect(on).toContain("flipped");
	});

	it("drops a class entirely rather than emitting undefined when a style key is missing", () => {
		// Deeper regression: even before the && bug, an element/rarity whose key is absent from the module would have stringified to "undefined" inside the template. filter(Boolean) drops it so a partial style map yields no stray token.
		const partial = { dummy: "dummy" } as Readonly<Record<string, string>>;
		const result = tokens(heroCardClassName({ ...base, styles: partial }));
		expect(result).not.toContain("undefined");
	});
});
