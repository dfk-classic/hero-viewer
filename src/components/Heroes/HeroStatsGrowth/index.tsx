import React from "react";
import stats from "../utils/stats";
import GrowthStat from "../GrowthStat";
import StatTab from "../StatTab";
import StatColumn from "../StatColumn";
import styles from "../HeroCard/styles.module.css";
import type { Hero } from "../../../types/hero";

interface HeroStatsGrowthProps {
	hero?: Hero;
}

// The two growth columns share their stat-list body and differ only in heading, top margin and the position passed to each GrowthStat.
const GROWTH_COLUMNS: {
	title: string;
	marginTop: string;
	position: "primary" | "secondary";
}[] = [
	{ title: "Primary Growth", marginTop: ".5rem", position: "primary" },
	{ title: "Secondary Growth", marginTop: ".75rem", position: "secondary" },
];

const HeroStatsGrowth = ({ hero }: HeroStatsGrowthProps) => {
	if (!hero) return null;
	return (
		<StatTab>
			{GROWTH_COLUMNS.map(({ title, marginTop, position }) => (
				<StatColumn key={position} title={title} marginTop={marginTop}>
					<div className={`${styles.statList}`}>
						{stats.map((stat) => (
							<GrowthStat
								key={stat.abbr}
								hero={hero}
								stat={stat}
								position={position}
								labelType="abbr"
							/>
						))}
					</div>
				</StatColumn>
			))}
		</StatTab>
	);
};

export default React.memo(HeroStatsGrowth);
