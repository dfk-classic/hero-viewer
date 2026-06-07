import React from "react";
import { capPercent } from "../utils/percent";
import styles from "../HeroCard/styles.module.css";

interface StatBarProps {
	rowClassName: string;
	label: React.ReactNode;
	barClassName: string;
	percent: number;
	amountClassName: string;
	barChildren?: React.ReactNode;
	children: React.ReactNode;
}

// One labelled stat bar — summons, stamina or XP — built from a row caption, a fill bar capped at 100%, and the amount readout. The variant-specific styles.module classes are passed in so each call keeps its own colour and the bar's own width animation, while the shared row/bar/amount structure lives here once.
const StatBar = ({
	rowClassName,
	label,
	barClassName,
	percent,
	amountClassName,
	barChildren,
	children,
}: StatBarProps) => (
	<div className={`${rowClassName} ${styles.row}`}>
		{label}
		<div className={styles.bar}>
			<div
				className={barClassName}
				style={{ width: capPercent(percent) + "%" }}
			>
				{barChildren}
			</div>
		</div>
		<div className={`${amountClassName} ${styles.amount}`}>{children}</div>
	</div>
);

export default React.memo(StatBar);
