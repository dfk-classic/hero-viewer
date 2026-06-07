import React from "react";
import styles from "../HeroCard/styles.module.css";

interface StatColumnProps {
	title: string;
	marginTop?: string;
	children: React.ReactNode;
}

// One stat-tab column — the shared col wrapper and its h3 heading. The four stat tabs (skills, growth, abilities, recessive) each render one or two of these, differing only in heading text, the heading's top margin and the body.
const StatColumn = ({ title, marginTop = ".5rem", children }: StatColumnProps) => (
	<div className={styles.col}>
		<h3 style={{ marginTop }}>{title}</h3>
		{children}
	</div>
);

export default React.memo(StatColumn);
