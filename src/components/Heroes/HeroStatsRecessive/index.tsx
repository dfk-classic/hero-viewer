import React from "react";
import styles from "../HeroCard/styles.module.css";

interface HeroStatsRecessiveProps {
	hero?: any;
	slot: "r1" | "r2" | "r3";
}

// Recessive genes tab, HONK Marketplace layout and colors. One component per
// recessive slot. Trait order follows the documented gene encoding; HONK's
// own display swaps active1/active2 here, which we intentionally do not copy.
const COLORS = {
	class: "#e6c15a",
	subClass: "#d14f69",
	profession: "#8bc34a",
	statBoost1: "#ff9800",
	statBoost2: "#4caf50",
	active: "#2196f3",
	passive: "#9c27b0",
};

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

const HeroStatsRecessive = ({ hero, slot }: HeroStatsRecessiveProps) => {
	const g = hero?.genes?.stat;
	if (!g) return null;
	const v = (trait: string) => String(g[trait][slot].name);
	return (
		<div style={{ padding: "0 10px" }}>
			<div className={styles.col}>
				<h3 style={{ marginTop: ".5rem" }}>
					Recessive Genes ({slot.toUpperCase()})
				</h3>
				<div className={styles.geneList}>
					<div className={styles.genePair}>
						<div className={styles.geneRow}>
							<div className={styles.geneName}>Class</div>
							<div className={styles.geneValue} style={{ color: COLORS.class }}>
								{v("mainClass")}
							</div>
						</div>
						<div className={styles.geneRow}>
							<div className={styles.geneName}>Subclass</div>
							<div
								className={styles.geneValue}
								style={{ color: COLORS.subClass }}
							>
								{v("subClass")}
							</div>
						</div>
					</div>
					<div className={styles.geneRow}>
						<div className={styles.geneName}>Profession</div>
						<div
							className={styles.geneValue}
							style={{ color: COLORS.profession }}
						>
							{cap(v("profession"))}
						</div>
					</div>
					<div className={styles.genePair}>
						<div className={styles.geneRow}>
							<div className={styles.geneName}>Stat Boost 1</div>
							<div
								className={styles.geneValue}
								style={{ color: COLORS.statBoost1 }}
							>
								{v("statBoost1")}
							</div>
						</div>
						<div className={styles.geneRow}>
							<div className={styles.geneName}>Stat Boost 2</div>
							<div
								className={styles.geneValue}
								style={{ color: COLORS.statBoost2 }}
							>
								{v("statBoost2")}
							</div>
						</div>
					</div>
					<div className={styles.geneRow}>
						<div className={styles.geneName}>Active 1</div>
						<div className={styles.geneValue} style={{ color: COLORS.active }}>
							{v("active1")}
						</div>
					</div>
					<div className={styles.geneRow}>
						<div className={styles.geneName}>Active 2</div>
						<div className={styles.geneValue} style={{ color: COLORS.active }}>
							{v("active2")}
						</div>
					</div>
					<div className={styles.geneRow}>
						<div className={styles.geneName}>Passive 1</div>
						<div className={styles.geneValue} style={{ color: COLORS.passive }}>
							{v("passive1")}
						</div>
					</div>
					<div className={styles.geneRow}>
						<div className={styles.geneName}>Passive 2</div>
						<div className={styles.geneValue} style={{ color: COLORS.passive }}>
							{v("passive2")}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(HeroStatsRecessive);
