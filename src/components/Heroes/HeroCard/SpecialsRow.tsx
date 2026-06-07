import React from "react";
import styles from "./styles.module.css";
import IconBadge from "./IconBadge";
import { elementIcons, backgroundIcons, genderIcons } from "./heroIcons";
import type { Hero as HeroType } from "../../../types/hero";

interface SpecialsRowProps {
  hero: HeroType;
}

// The element / background / gender trait badges, rendered identically on the front and back of the card frame.
const SpecialsRow = ({ hero }: SpecialsRowProps) => (
  <div className={`${styles.specials} ${styles.row}`}>
    <IconBadge src={elementIcons[hero.element]} label={hero.element} />
    <IconBadge
      src={backgroundIcons[hero.visualGenes.background]}
      label={hero.background}
    />
    <IconBadge
      src={genderIcons[hero.gender] ?? genderIcons.male}
      label={hero.gender}
    />
  </div>
);

export default React.memo(SpecialsRow);
