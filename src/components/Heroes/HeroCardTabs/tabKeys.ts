// Keyboard handling for the card's tab bar, following the WAI-ARIA tabs pattern
// with automatic activation: arrow keys move (and select) the adjacent tab,
// Home/End jump to the ends, and Enter/Space (re)activate the focused tab.
export type TabKeyResult = { index: number; activate: boolean };

// Maps a keydown to the tab that should receive focus and selection. Returns
// null for keys the tab bar does not own, so their default behaviour (Tab to
// leave the list, typing, etc.) is left untouched. Indices wrap around the ends.
export function resolveTabKey(
	key: string,
	currentIndex: number,
	count: number,
): TabKeyResult | null {
	if (count <= 0) return null;
	switch (key) {
		case "ArrowRight":
		case "ArrowDown":
			return { index: (currentIndex + 1) % count, activate: true };
		case "ArrowLeft":
		case "ArrowUp":
			return { index: (currentIndex - 1 + count) % count, activate: true };
		case "Home":
			return { index: 0, activate: true };
		case "End":
			return { index: count - 1, activate: true };
		case "Enter":
		case " ":
			return { index: currentIndex, activate: true };
		default:
			return null;
	}
}
