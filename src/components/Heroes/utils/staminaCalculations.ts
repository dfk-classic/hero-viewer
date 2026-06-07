import { DateTime } from "luxon";
import type { Hero } from "../../../types/hero";

export const calculateRemainingStamina = (hero: Hero): number => {
	const secondsPerStaminaPoint = 1200;
	const currentTime = DateTime.fromJSDate(new Date());
	const staminaFullAt = hero.staminaFullAt;

	if (!staminaFullAt || staminaFullAt <= currentTime) {
		return hero.stats.stamina;
	}

	const diffInSeconds = staminaFullAt.diff(currentTime, ["seconds"]);
	const finalDiff = diffInSeconds.toObject().seconds;

	if (finalDiff) {
		// Stamina is a non-negative game resource; clamp at zero so a recharge time far in the future can never drive the remaining value below what the UI can meaningfully show.
		return Math.max(0, hero.stats.stamina - Math.ceil(finalDiff / secondsPerStaminaPoint));
	} else {
		return hero.stats.stamina;
	}
};

// Builds the "Full <relative time>" stamina label without ever dereferencing a missing or invalid recharge time: the guard runs before toRelative, so a null/undefined staminaFullAt or an out-of-range DateTime.fromSeconds result resolves to a plain "Full" rather than throwing on the missing value or rendering the literal "Full null". Passing the reference instant in keeps the relative phrasing deterministic against a single "now".
export function staminaFullLabel(staminaFullAt: DateTime | null | undefined, now: DateTime): string {
	if (!staminaFullAt || !staminaFullAt.isValid || staminaFullAt <= now) {
		return "Full";
	}
	const relative = staminaFullAt.toRelative({ base: now });
	return relative ? `Full ${relative}` : "Full";
}
