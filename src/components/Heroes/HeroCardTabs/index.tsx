import React, { useRef } from "react";
import styles from "./styles.module.css";
import { resolveTabKey } from "./tabKeys";

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
	const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
	const activeIndex = Math.max(
		0,
		tabs.findIndex((tab) => tab.label === activeTab),
	);

	return (
		<div className={styles.tabs} role="tablist" aria-label="Hero detail pages">
			{tabs.map((tab, index) => {
				const selected = activeTab === tab.label;
				return (
					<div
						key={tab.label}
						ref={(node) => {
							tabRefs.current[index] = node;
						}}
						className={`${styles.tab} ${selected ? styles.active : ""}`}
						title={tab.label}
						role="tab"
						aria-selected={selected}
						aria-label={tab.label}
						tabIndex={selected ? 0 : -1}
						onClick={(e) => {
							e.stopPropagation(); // inner control, never flips the card
							onTabChange(tab.label);
						}}
						onKeyDown={(e) => {
							const result = resolveTabKey(e.key, activeIndex, tabs.length);
							if (!result) return;
							e.preventDefault(); // claim arrows/space before the card sees them
							e.stopPropagation();
							onTabChange(tabs[result.index].label);
							tabRefs.current[result.index]?.focus();
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
				);
			})}
		</div>
	);
};

export default React.memo(HeroCardTabs);
