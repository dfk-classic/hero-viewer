export type RosterEntry = { id: string; chain: string };

// Parse the roster CSV: drop the header row, then split each remaining line into its id and chain columns. Splitting on /\r?\n/ tolerates CRLF files (roster.csv ships with CRLF endings) so chain values never carry a trailing \r, which would otherwise miss the CHAINS lookup and silently route Kaia heroes to DFK Chain. Kept pure and separate from the component so the parsing and the load-failure handling can be exercised without a DOM.
export function parseRoster(csv: string): RosterEntry[] {
	return csv
		.trim()
		.split(/\r?\n/)
		.slice(1)
		.map((line) => {
			const [id, chain] = line.split(",");
			return { id, chain };
		});
}

export type RosterLoadResult = { entries: RosterEntry[]; status: string };

// Load and parse the roster, turning any failure into a visible status instead of an unhandled rejection that would leave the UI stuck on "loading roster…". The CSV fetch is injected so the success and failure paths are both testable.
export async function loadRoster(
	fetchCsv: () => Promise<string>,
): Promise<RosterLoadResult> {
	try {
		const entries = parseRoster(await fetchCsv());
		return {
			entries,
			status: `roster loaded: ${entries.length.toLocaleString()} transcended heroes. Pick a sample.`,
		};
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		return { entries: [], status: `roster failed to load: ${message.slice(0, 90)}` };
	}
}

// Pick up to `count` distinct roster entries at random, without repeats. The target is clamped to the roster length so asking for more heroes than exist returns the whole roster instead of looping forever hunting for distinct indices that cannot exist (count <= 0 or an empty roster yields []). The RNG is injected — defaulting to Math.random, and expected to return values in [0, 1) like Math.random — so the distinct-selection and clamp behaviour can be exercised deterministically without a DOM.
export function samplePicks(
	roster: RosterEntry[],
	count: number,
	rng: () => number = Math.random,
): RosterEntry[] {
	const target = Math.min(count, roster.length);
	const picks: RosterEntry[] = [];
	const used = new Set<number>();
	while (picks.length < target) {
		const i = Math.floor(rng() * roster.length);
		if (!used.has(i)) {
			used.add(i);
			picks.push(roster[i]);
		}
	}
	return picks;
}
