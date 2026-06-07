import { describe, it, expect } from "vitest";
import { parseRoster, loadRoster } from "../../src/roster";

const CSV = "id,chain\n1,dfkchain\n2,klaytn\n3,dfkchain";

describe("parseRoster", () => {
	it("skips the header row and splits each line into id and chain", () => {
		expect(parseRoster(CSV)).toEqual([
			{ id: "1", chain: "dfkchain" },
			{ id: "2", chain: "klaytn" },
			{ id: "3", chain: "dfkchain" },
		]);
	});

	it("returns an empty list for a header-only roster", () => {
		expect(parseRoster("id,chain")).toEqual([]);
	});
});

describe("loadRoster", () => {
	it("reports the loaded entries and a count status on success", async () => {
		const result = await loadRoster(async () => CSV);
		expect(result.entries).toHaveLength(3);
		expect(result.status).toContain("roster loaded: 3");
	});

	it("turns a fetch rejection into an error status instead of throwing", async () => {
		// Regression guard: the roster effect previously had no catch, so a failed CSV
		// fetch produced an unhandled rejection and left the UI stuck on "loading roster…".
		// loadRoster must resolve with an empty roster and a visible failure status.
		const result = await loadRoster(async () => {
			throw new Error("network down");
		});
		expect(result.entries).toEqual([]);
		expect(result.status).toContain("roster failed to load");
		expect(result.status).toContain("network down");
	});
});
