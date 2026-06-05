import React from "react";
import styles from "./styles.module.css";

// Tab bar on the back of the card, HONK Marketplace style:
// Stats / Growth / Abilities / Recessive 1 / Recessive 2.
export type CardTab = {
	label: string;
	symbol: string;
	recessive?: boolean;
	sup?: string;
};

interface HeroCardTabsProps {
	tabs: CardTab[];
	activeTab: string;
	onTabChange: (label: string) => void;
}

const HeroCardTabs = ({ tabs, activeTab, onTabChange }: HeroCardTabsProps) => {
	return (
		<div className={styles.tabs}>
			{tabs.map((tab) => (
				<div
					key={tab.label}
					className={`${styles.tab} ${
						activeTab === tab.label ? styles.active : ""
					}`}
					title={tab.label}
					onClick={(e) => {
						e.stopPropagation(); // inner control, never flips the card
						onTabChange(tab.label);
					}}
				>
					<span
						className={`${styles.symbol} ${
							tab.recessive ? styles.recessiveSymbol : ""
						}`}
					>
						{tab.symbol}
						{tab.sup && <span className={styles.sup}>{tab.sup}</span>}
					</span>
				</div>
			))}
		</div>
	);
};

export default React.memo(HeroCardTabs);
