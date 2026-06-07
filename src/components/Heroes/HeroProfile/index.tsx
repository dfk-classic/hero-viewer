import React from "react";
import Hero from "../Hero";
import styles from "./index.module.scss";
import type { Hero as HeroType } from "../../../types/hero";

interface HeroProfile {
	hero: HeroType | null;
	placeholderComponent?: JSX.Element;
	profileChoice?: boolean;
	profileSmall?: boolean;
}

const HeroProfile = ({
	hero,
	placeholderComponent,
	profileChoice,
	profileSmall,
}: HeroProfile) => {
	return (
		<button
			className={[
				styles.heroProfileSquare,
				profileChoice && styles.profileChoice,
				profileSmall && styles.profileSmall,
			]
				.filter(Boolean)
				.join(" ")}
			title={
				hero?.name
					? hero.name.replace(/(^\w{1})|(\s{1}\w{1})/g, (s: string) =>
							s.toUpperCase()
						)
					: undefined
			}
		>
			<div className={styles.heroFrame}>
				<div className={styles.heroContainer}>
					{hero && <Hero hero={hero} />}
				</div>
				{!hero && placeholderComponent}
			</div>
		</button>
	);
};

export default React.memo(HeroProfile);
