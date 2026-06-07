import React from "react";
import styles from "./styles.module.css";

interface IconBadgeProps {
  src?: string;
  label: string;
}

// A single trait badge on the card frame: optional icon image plus a hover tooltip. The image is omitted when no asset resolves for the trait value, matching the card's original per-trait guards.
const IconBadge = ({ src, label }: IconBadgeProps) => (
  <div className={styles.icon}>
    {src && <img src={src} alt="" />}
    <span className={styles.tooltip}>{label}</span>
  </div>
);

export default React.memo(IconBadge);
