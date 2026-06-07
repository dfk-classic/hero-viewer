import type { Hero } from "./types/hero";

// Stable React list key for a hero, keyed on its on-chain id so a card keeps its identity — and its already-mounted, SVG-heavy subtree — even as earlier roster slots fill in out of order during a batch load and shift the hero's position in the filtered array. The old index-suffixed key changed whenever an earlier slot resolved, forcing React to unmount and rebuild the whole hero render tree on every out-of-order arrival. Falls back to the array index only for the defensive case of a hero arriving without an id, where no stable identity exists.
export function heroKey(hero: Pick<Hero, "id">, index: number): string {
	return hero.id == null ? `i${index}` : `#${hero.id}`;
}
