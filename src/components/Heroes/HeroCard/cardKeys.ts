// Enter and Space are the keys that activate a native <button>. The card's flip
// toggle and the hero-id copy control are <div>s with button semantics, so they
// reuse this predicate to mirror that activation for keyboard users while mouse
// users keep the existing onClick.
export function isActivateKey(key: string): boolean {
	return key === "Enter" || key === " ";
}
