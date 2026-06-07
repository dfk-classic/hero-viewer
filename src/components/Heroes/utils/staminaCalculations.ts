import { DateTime } from "luxon";
import type { Hero } from "../../../types/hero";

export const calculateRemainingStamina = (hero: Hero) => {
	const secondsPerStaminaPoint = 1200;
	const currentTime = DateTime.fromJSDate(new Date());
	const staminaFullAt = hero.staminaFullAt;

	if (!staminaFullAt || staminaFullAt <= currentTime) {
		return hero.stats.stamina;
	}

	const diffInSeconds = staminaFullAt.diff(currentTime, ["seconds"]);
	const finalDiff = diffInSeconds.toObject().seconds;

	if (finalDiff) {
		// Stamina is a non-negative game resource; clamp at zero so a recharge time far in the
		// future can never drive the remaining value below what the UI can meaningfully show.
		return Math.max(0, hero.stats.stamina - Math.ceil(finalDiff / secondsPerStaminaPoint));
	} else {
		return hero.stats.stamina;
	}
};
