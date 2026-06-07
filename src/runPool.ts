// Run an async `worker` over `items` with at most `limit` of them in flight at
// once, handing each worker its original index so callers can drop results back
// into position. The effective concurrency is clamped to [1, items.length]: a
// limit larger than the work spawns only as many runners as there are items, and
// a non-positive limit still floors at one runner rather than deadlocking on
// zero. `shouldCancel` is polled before each item is claimed so a caller can
// abandon the remaining work — e.g. a newer batch superseding this one — without
// rejecting; workers already in flight are left to settle.
export async function runPool<T>(
	items: T[],
	limit: number,
	worker: (item: T, index: number) => Promise<void>,
	shouldCancel: () => boolean = () => false,
): Promise<void> {
	const concurrency = Math.max(1, Math.min(limit, items.length));
	let next = 0;
	// Claiming `next` and incrementing it happen with no await in between, so the
	// index hand-off is atomic across runners and no item is processed twice.
	async function runner(): Promise<void> {
		while (next < items.length) {
			if (shouldCancel()) return;
			const index = next++;
			await worker(items[index], index);
		}
	}
	await Promise.all(Array.from({ length: concurrency }, () => runner()));
}
