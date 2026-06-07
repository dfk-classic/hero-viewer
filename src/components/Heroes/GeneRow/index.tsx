import React from "react";
import styles from "../HeroCard/styles.module.css";

interface GeneRowProps {
	label: string;
	value: React.ReactNode;
	color?: string;
}

// One gene name/value row, shared by the Abilities and Recessive tabs. The optional colour tints the value the way each recessive trait family is coloured; the Abilities tab omits it and keeps the default text colour.
const GeneRow = ({ label, value, color }: GeneRowProps) => (
	<div className={styles.geneRow}>
		<div className={styles.geneName}>{label}</div>
		<div className={styles.geneValue} style={color ? { color } : undefined}>
			{value}
		</div>
	</div>
);

export default React.memo(GeneRow);
