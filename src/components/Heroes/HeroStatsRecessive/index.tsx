import React from "react";
import GeneRow from "../GeneRow";
import StatTab from "../StatTab";
import StatColumn from "../StatColumn";
import { recessiveRows } from "./recessiveRows";
import styles from "../HeroCard/styles.module.css";
import type { Hero } from "../../../types/hero";

interface HeroStatsRecessiveProps {
	hero?: Hero;
	slot: "r1" | "r2" | "r3";
}

// Recessive genes tab, HONK Marketplace layout and colors. One component per recessive slot; the row values and trait order live in recessiveRows so each slot stays a thin render of that shared layout.
const HeroStatsRecessive = ({ hero, slot }: HeroStatsRecessiveProps) => {
	const g = hero?.genes?.stat;
	if (!g) return null;
	const groups = recessiveRows(g, slot);
	return (
		<StatTab>
			<StatColumn title={`Recessive Genes (${slot.toUpperCase()})`}>
				<div className={styles.geneList}>
					{groups.map((group, i) => {
						const rows = group.rows.map((row) => (
							<GeneRow
								key={row.label}
								label={row.label}
								value={row.value}
								color={row.color}
							/>
						));
						return group.pair ? (
							<div className={styles.genePair} key={i}>
								{rows}
							</div>
						) : (
							<React.Fragment key={i}>{rows}</React.Fragment>
						);
					})}
				</div>
			</StatColumn>
		</StatTab>
	);
};

export default React.memo(HeroStatsRecessive);
