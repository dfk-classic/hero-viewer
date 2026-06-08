// @vitest-environment jsdom
import React, { useState } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import HeroCardTabs from "../../src/components/Heroes/HeroCardTabs";
import type { CardTab } from "../../src/components/Heroes/HeroCardTabs";

// Vitest does not auto-run React Testing Library's cleanup without globals enabled, so unmount between tests by hand or each render leaks its DOM into the next assertion.
afterEach(cleanup);

const TABS: CardTab[] = [
	{ label: "Stats", symbol: "S" },
	{ label: "Growth", symbol: "G" },
	{ label: "Abilities", symbol: "A" },
];

type HarnessProps = {
	tabs: CardTab[];
	initialActive?: string;
	onChange?: (label: string) => void;
	onParentKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
	onParentClick?: React.MouseEventHandler<HTMLDivElement>;
};

// HeroCardTabs is a controlled component, so a stateful harness mirrors how HeroCard drives it: it owns the active label and feeds it back through activeTab, which is what makes the roving tabindex and aria-selected actually move when a key fires. The parent div carries optional spies so the propagation contract (owned keys are swallowed, the card never sees them) can be asserted.
function Harness({ tabs, initialActive, onChange, onParentKeyDown, onParentClick }: HarnessProps) {
	const [active, setActive] = useState(initialActive ?? tabs[0].label);
	return (
		<div onKeyDown={onParentKeyDown} onClick={onParentClick}>
			<HeroCardTabs
				tabs={tabs}
				activeTab={active}
				onTabChange={(label) => {
					onChange?.(label);
					setActive(label);
				}}
			/>
		</div>
	);
}

describe("HeroCardTabs", () => {
	it("exposes a tablist with one roving-tabindex tab per entry, only the active one reachable by Tab", () => {
		render(<Harness tabs={TABS} />);
		expect(screen.getByRole("tablist", { name: "Hero detail pages" })).toBeInTheDocument();
		const tabs = screen.getAllByRole("tab");
		expect(tabs).toHaveLength(3);
		// Roving tabindex: exactly the selected tab is in the page tab order (tabindex 0), the rest are reachable only via the arrow keys (tabindex -1).
		expect(tabs[0]).toHaveAttribute("aria-selected", "true");
		expect(tabs[0]).toHaveAttribute("tabindex", "0");
		expect(tabs[1]).toHaveAttribute("aria-selected", "false");
		expect(tabs[1]).toHaveAttribute("tabindex", "-1");
		expect(tabs[2]).toHaveAttribute("tabindex", "-1");
	});

	it("moves selection and focus to the next tab on ArrowRight", () => {
		render(<Harness tabs={TABS} />);
		fireEvent.keyDown(screen.getByRole("tab", { name: "Stats" }), { key: "ArrowRight" });
		const growth = screen.getByRole("tab", { name: "Growth" });
		expect(growth).toHaveAttribute("aria-selected", "true");
		expect(growth).toHaveAttribute("tabindex", "0");
		expect(growth).toHaveFocus();
		expect(screen.getByRole("tab", { name: "Stats" })).toHaveAttribute("tabindex", "-1");
	});

	it("wraps from the first tab to the last on ArrowLeft", () => {
		render(<Harness tabs={TABS} />);
		fireEvent.keyDown(screen.getByRole("tab", { name: "Stats" }), { key: "ArrowLeft" });
		const abilities = screen.getByRole("tab", { name: "Abilities" });
		expect(abilities).toHaveAttribute("aria-selected", "true");
		expect(abilities).toHaveFocus();
	});

	it("jumps to the last tab on End and back to the first on Home", () => {
		render(<Harness tabs={TABS} />);
		fireEvent.keyDown(screen.getByRole("tab", { name: "Stats" }), { key: "End" });
		const abilities = screen.getByRole("tab", { name: "Abilities" });
		expect(abilities).toHaveAttribute("aria-selected", "true");
		expect(abilities).toHaveFocus();
		fireEvent.keyDown(abilities, { key: "Home" });
		const stats = screen.getByRole("tab", { name: "Stats" });
		expect(stats).toHaveAttribute("aria-selected", "true");
		expect(stats).toHaveFocus();
	});

	it("activates the focused tab on Space and claims the key from the card", () => {
		const onChange = vi.fn();
		render(<Harness tabs={TABS} onChange={onChange} />);
		// fireEvent returns false when the handler called preventDefault; Space must be claimed so the page does not scroll and the card never sees it.
		const notPrevented = fireEvent.keyDown(screen.getByRole("tab", { name: "Stats" }), { key: " " });
		expect(notPrevented).toBe(false);
		expect(onChange).toHaveBeenCalledWith("Stats");
		expect(screen.getByRole("tab", { name: "Stats" })).toHaveAttribute("aria-selected", "true");
	});

	it("swallows owned keys so the card never flips, but lets unowned keys bubble through", () => {
		const onParentKeyDown = vi.fn();
		render(<Harness tabs={TABS} onParentKeyDown={onParentKeyDown} />);
		fireEvent.keyDown(screen.getByRole("tab", { name: "Stats" }), { key: "ArrowRight" });
		// An owned key (arrow) is stopPropagation'd inside the tab, so the surrounding card handler must not fire — otherwise the card would flip while the user is only changing tabs.
		expect(onParentKeyDown).not.toHaveBeenCalled();
		fireEvent.keyDown(screen.getByRole("tab", { name: "Growth" }), { key: "b" });
		// An unowned key returns before stopPropagation, so it still reaches the card and the card's own shortcuts keep working.
		expect(onParentKeyDown).toHaveBeenCalledTimes(1);
	});

	it("activates a tab on click without bubbling to the card", () => {
		const onChange = vi.fn();
		const onParentClick = vi.fn();
		render(<Harness tabs={TABS} onChange={onChange} onParentClick={onParentClick} />);
		fireEvent.click(screen.getByRole("tab", { name: "Growth" }));
		expect(onChange).toHaveBeenCalledWith("Growth");
		// The click is an inner control action; it must be stopped before the card's onClick so a tab switch never doubles as a card flip.
		expect(onParentClick).not.toHaveBeenCalled();
	});
});
