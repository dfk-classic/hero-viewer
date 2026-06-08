import { describe, it, expect } from "vitest";
import { parseRoster, loadRoster, samplePicks } from "../../src/roster";
import type { RosterEntry } from "../../src/roster";

// A deterministic stand-in for Math.random that yields the given values in order and throws once exhausted, so a clamp regression that would loop forever fails fast instead of hanging the suite.
function seqRng(values: number[]): () => number {
	let i = 0;
	return () => {
		if (i >= values.length) throw new Error("seqRng exhausted");
		return values[i++];
	};
}

function rosterOf(n: number): RosterEntry[] {
	return Array.from({ length: n }, (_, i) => ({ id: String(i), chain: "dfkchain" }));
}

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

	it("strips CRLF line endings so chain values stay clean", () => {
		// Regression guard: roster.csv ships with CRLF endings. Splitting on "\n" alone leaves a trailing "\r" on every chain ("kaia\r"), which misses the CHAINS lookup in chainHero and silently routes Kaia heroes to DFK Chain.
		const crlf = "id,chain\r\n1,dfkchain\r\n2,kaia\r\n3,dfkchain";
		expect(parseRoster(crlf)).toEqual([
			{ id: "1", chain: "dfkchain" },
			{ id: "2", chain: "kaia" },
			{ id: "3", chain: "dfkchain" },
		]);
	});

	it("drops blank and incomplete rows instead of emitting junk entries", () => {
		// Regression guard: a blank line or a row missing the chain column used to parse into { id: "", chain: undefined } (or { id, chain: undefined }), which inflated the loaded count and queued an on-chain fetch with no id/chain that could only fail. Such rows must be dropped.
		const messy = "id,chain\n1,dfkchain\n\n2,kaia\n3";
		expect(parseRoster(messy)).toEqual([
			{ id: "1", chain: "dfkchain" },
			{ id: "2", chain: "kaia" },
		]);
	});
});

describe("loadRoster", () => {
	it("reports the loaded entries and a count status on success", async () => {
		const result = await loadRoster(async () => CSV);
		expect(result.entries).toHaveLength(3);
		expect(result.status).toContain("roster loaded: 3");
	});

	it("turns a fetch rejection into an error status instead of throwing", async () => {
		// Regression guard: the roster effect previously had no catch, so a failed CSV fetch produced an unhandled rejection and left the UI stuck on "loading roster…". loadRoster must resolve with an empty roster and a visible failure status.
		const result = await loadRoster(async () => {
			throw new Error("network down");
		});
		expect(result.entries).toEqual([]);
		expect(result.status).toContain("roster failed to load");
		expect(result.status).toContain("network down");
	});
});

describe("samplePicks", () => {
	it("returns count distinct entries, skipping repeated random indices", () => {
		// rng hits index 0 twice; the duplicate must be skipped, not counted, so the result is three distinct heroes rather than [0, 0, 1].
		const picks = samplePicks(rosterOf(5), 3, seqRng([0, 0, 0.25, 0.5]));
		expect(picks.map((p) => p.id)).toEqual(["0", "1", "2"]);
		expect(new Set(picks.map((p) => p.id)).size).toBe(3);
	});

	it("clamps to the roster length when count exceeds it, without looping forever", () => {
		// Regression guard: without Math.min(count, length) the while loop can never reach `count` distinct indices and spins forever. seqRng throws on exhaustion, so a missing clamp fails the test instead of hanging it.
		const picks = samplePicks(rosterOf(3), 10, seqRng([0, 0.34, 0.67]));
		expect(picks).toHaveLength(3);
		expect(new Set(picks.map((p) => p.id))).toEqual(new Set(["0", "1", "2"]));
	});

	it("returns an empty list for a non-positive count or an empty roster", () => {
		expect(samplePicks(rosterOf(5), 0)).toEqual([]);
		expect(samplePicks(rosterOf(5), -3)).toEqual([]);
		expect(samplePicks([], 5)).toEqual([]);
	});
});
