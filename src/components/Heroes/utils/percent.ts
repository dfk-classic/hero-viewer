// Cap a percentage at its 100% ceiling for bar-width display. Values already within range pass through unchanged; the lower bound is intentionally left alone because the stat bars never receive negative input.
export function capPercent(pct: number): number {
	return pct <= 100 ? pct : 100;
}
