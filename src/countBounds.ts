// Bounds for the "show N heroes" count input. MIN_COUNT doubles as the fallback
// when the field is cleared or holds a non-numeric value, and both constants feed
// the input's own min/max attributes so the typed value and the clamped value can
// never diverge from a stray literal.
export const MIN_COUNT = 1;
export const MAX_COUNT = 60;

// Coerce a raw count input to a number within [MIN_COUNT, MAX_COUNT]. Empty, zero,
// and non-numeric values fall back to MIN_COUNT — Number("") is 0 and Number("abc")
// is NaN, both falsy — preserving the input's original inline clamp exactly.
export function clampCount(raw: string | number): number {
	return Math.max(MIN_COUNT, Math.min(MAX_COUNT, Number(raw) || MIN_COUNT));
}
