// Shape of a CSS-module import: vite/client types `*.module.css` as a readonly string map, so the helper takes the same so callers can pass `styles` straight through.
type CardStyles = Readonly<Record<string, string>>;

export interface HeroCardClassInput {
	styles: CardStyles;
	element: string;
	rarity: string;
	shiny: boolean;
	shinyStyle: number;
	isAnimated?: boolean;
	flipToggle?: boolean;
	flipped: boolean;
}

// Builds the hero card's wrapper class list from style-module tokens. Each modifier resolves to its class or an empty string, and the final filter(Boolean) strips every falsy entry, so an absent or disabled modifier can never reach the DOM as a literal "undefined"/"false" class — the defect `${isAnimated && styles.animate}` produced on every card the App rendered without an isAnimated prop.
export function heroCardClassName({
	styles,
	element,
	rarity,
	shiny,
	shinyStyle,
	isAnimated,
	flipToggle,
	flipped,
}: HeroCardClassInput): string {
	return [
		styles.heroCard,
		isAnimated ? styles.animate : "",
		flipToggle ? styles.flippable : "",
		shiny ? styles.shiny : "",
		shiny ? styles[`shiny${shinyStyle}`] : "",
		styles[element],
		styles[rarity],
		flipped ? styles.flipped : "",
	]
		.filter(Boolean)
		.join(" ");
}
