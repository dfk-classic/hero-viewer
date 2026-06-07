import React from "react";
import { MouseoverTooltip } from "../../Tooltip";
import { DateTime } from "luxon";
import { calculateRequiredXp } from "./utils/heroes";
import { calculateRemainingStamina, staminaFullLabel } from "../utils/staminaCalculations";
import StatBar from "./StatBar";
import styles from "../HeroCard/styles.module.css";
import type { Hero } from "../../../types/hero";

interface HeroInfoProps {
	hero: Hero;
}

const HeroInfo = ({ hero }: HeroInfoProps) => {
	const remainingStamina = calculateRemainingStamina(hero);
	const staminaPercentage = (remainingStamina / hero.stats.stamina) * 100;
	const currentTime = DateTime.fromJSDate(new Date());
	const staminaFullAtString = staminaFullLabel(hero.staminaFullAt, currentTime);
	const tooltips: Record<string, string> = {
		staminaFullAtString: staminaFullAtString,
	};
	const summonPercentage =
		hero.generation === 0
			? 100
			: hero.maxSummons === 0
			? 0
			: ((hero.maxSummons - hero.summons) / hero.maxSummons) * 100;
	const xpNextLevel = calculateRequiredXp(hero.level);
	const xpPercentage = (hero.xp / xpNextLevel) * 100;

	return (
		<>
			<div className={styles.heroStats}>
				<div className={styles.heroFrame}>
					<StatBar
						rowClassName={styles.statSummons}
						label="Summons"
						barClassName={styles.summonsBar}
						percent={summonPercentage}
						amountClassName={styles.summonsAmount}
					>
						{hero.generation === 0 ? (
							<div style={{ display: "flex", alignItems: "center" }}>
								<span style={{ fontSize: "8px" }}>{hero.summons + "/"}</span>
								<span style={{ fontSize: "16px" }}>&infin;</span>
							</div>
						) : (
							`${hero.maxSummons - hero.summons}/${hero.maxSummons}`
						)}
					</StatBar>
					<div className={`${styles.statStaminaWrapper}`}>
						<MouseoverTooltip text={tooltips.staminaFullAtString}>
							<StatBar
								rowClassName={styles.statStamina}
								label="Stamina"
								barClassName={styles.staminaBar}
								percent={staminaPercentage}
								amountClassName={styles.staminaAmount}
								barChildren={
									staminaPercentage < 100 && (
										<div className={styles.staminaLoading} />
									)
								}
							>
								{remainingStamina}/{hero.stats.stamina}
							</StatBar>
						</MouseoverTooltip>
					</div>
					<StatBar
						rowClassName={styles.statXp}
						label="XP"
						barClassName={styles.xpBar}
						percent={xpPercentage}
						amountClassName={styles.xpAmount}
					>
						{hero.xp}/{xpNextLevel}
					</StatBar>
				</div>
			</div>
		</>
	);
};

export default React.memo(HeroInfo);
