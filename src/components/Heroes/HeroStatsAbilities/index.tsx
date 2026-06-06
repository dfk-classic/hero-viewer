import React from "react";
import styles from "../HeroCard/styles.module.css";
import type { Hero } from "../../../types/hero";

interface HeroStatsAbilitiesProps {
	hero?: Hero;
}

// Abilities tab, HONK Marketplace style: the four dominant ability genes
// with their full names ("Iron Skin (Basic5)").
const HeroStatsAbilities = ({ hero }: HeroStatsAbilitiesProps) => {
	const g = hero?.genes?.stat;
	if (!g) return null;
	const rows: [string, string | number][] = [
		["Active 1", g.active1.dominant.name],
		["Active 2", g.active2.dominant.name],
		["Passive 1", g.passive1.dominant.name],
		["Passive 2", g.passive2.dominant.name],
	];
	return (
		<div style={{ padding: "0 10px" }}>
			<div className={styles.col}>
				<h3 style={{ marginTop: ".5rem" }}>Ability Genes</h3>
				<div className={`${styles.geneList} ${styles.abilityList}`}>
					{rows.map(([label, value]) => (
						<div key={label} className={styles.geneRow}>
							<div className={styles.geneName}>{label}</div>
							<div className={styles.geneValue}>{value}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default React.memo(HeroStatsAbilities);
