// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "../../src/App";

beforeEach(() => {
	// App's mount effect fetches roster.csv; stub fetch with a header-only CSV so the load resolves deterministically to an empty roster instead of hitting the network (or throwing on an undefined fetch in jsdom) and leaving the status stuck.
	vi.stubGlobal("fetch", vi.fn(async () => ({ text: async () => "id,chain" })));
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

describe("App control bar accessibility", () => {
	it("gives the count and lookup inputs real accessible names", async () => {
		render(<App />);
		// Regression guard: the count input previously had a free-standing "show" label with no htmlFor, and the lookup input had only a placeholder, so neither had an accessible name (WCAG 4.1.2). A screen reader announced them as unlabelled. The label is now associated by id and the lookup input carries an aria-label.
		expect(screen.getByRole("spinbutton", { name: /show/i })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "hero ID" })).toBeInTheDocument();
		// Let the mount effect's roster load settle inside act so its setState does not fire after the test ends.
		await screen.findByText(/roster loaded/);
	});

	it("announces load status through a live region", async () => {
		render(<App />);
		// Regression guard: the status line was a plain div, so dynamic load progress and failure messages were never announced (WCAG 4.1.3). role="status" makes it a polite live region.
		const status = await screen.findByRole("status");
		expect(status).toHaveTextContent(/roster loaded/);
	});
});
