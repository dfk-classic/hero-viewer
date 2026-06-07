import React from "react"; // useState
import styles from "../HeroCard/styles.module.css";
import stats from "../utils/stats";
import type { Hero } from "../../../types/hero";

interface HeroStatsSkillsProps {
	hero?: Hero;
}

// The four hero professions in card display order. Each renders an identical name/level row, so the list drives both the chosen-profession highlight and the skills lookup off the same key.
const PROFESSIONS: { key: string; label: string }[] = [
	{ key: "mining", label: "Mining" },
	{ key: "gardening", label: "Gardening" },
	{ key: "fishing", label: "Fishing" },
	{ key: "foraging", label: "Foraging" },
];

/* exported component */
const HeroStatsSkills = ({ hero }: HeroStatsSkillsProps) => {
	if (!hero) return null;
	return (
		<>
			<div style={{ padding: "0 10px" }}>
				<div className={styles.col}>
					<h3 style={{ marginTop: ".5rem" }}>Stats</h3>
					<div className={styles.statList}>
						{stats.map((stat) => {
							return (
								<div key={stat.value}>
									<div className={styles.statName}>
										{stat.abbr === hero.statGenes.statBoost1 &&
										stat.abbr === hero.statGenes.statBoost2 ? (
											<>
												<span className={styles.statBoostDouble}>
													{stat.abbr}
												</span>
												<span className={styles.tooltip}>
													{stat.label}
													<span className={styles.statBoost}> +2</span>
													<br />
													<span className={styles.statBoost2}>
														+2 P%, +4 S%
													</span>
												</span>
											</>
										) : stat.abbr === hero.statGenes.statBoost1 ? (
											<>
												<span className={styles.statBoost}>{stat.abbr}</span>
												<span className={styles.tooltip}>
													{stat.label}
													<span className={styles.statBoost}> +2</span>
												</span>
											</>
										) : stat.abbr === hero.statGenes.statBoost2 ? (
											<>
												<span className={styles.statBoost2}>{stat.abbr}</span>
												<span className={styles.tooltip}>
													{stat.label}
													<br />
													<span className={styles.statBoost2}>
														+2 P%, +4 S%
													</span>
												</span>
											</>
										) : (
											<>
												{stat.abbr}
												<span className={styles.tooltip}>{stat.label}</span>
											</>
										)}
									</div>
									<div className={styles.statPoint}>
										{hero.stats[stat.value]}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className={styles.col}>
					<h3 style={{ marginTop: ".75rem" }}>Professions</h3>
					<div className={styles.skillList}>
						{PROFESSIONS.map(({ key, label }) => (
							<React.Fragment key={key}>
								<div
									className={`${styles.skillName} ${
										hero.statGenes.profession === key ? styles.chosen : ""
									}`}
								>
									{label}
									<span className={styles.tooltip}>Main</span>
								</div>
								<div className={styles.skillLevel}>
									{hero.skills[key].toFixed(1)}
								</div>
							</React.Fragment>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default React.memo(HeroStatsSkills);
