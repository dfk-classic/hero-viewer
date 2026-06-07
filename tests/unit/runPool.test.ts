import { describe, it, expect } from "vitest";
import { runPool } from "../../src/runPool";

// A deferred lets a test hold a worker open until it explicitly resolves it, so we can observe how many workers sit in flight at a chosen moment.
function deferred(): { promise: Promise<void>; resolve: () => void } {
	let resolve!: () => void;
	const promise = new Promise<void>((r) => {
		resolve = r;
	});
	return { promise, resolve };
}

describe("runPool", () => {
	it("processes every item exactly once, passing each its index", async () => {
		const seen: Array<[number, number]> = [];
		await runPool([10, 20, 30], 2, async (item, index) => {
			seen.push([index, item]);
		});
		seen.sort((a, b) => a[0] - b[0]);
		expect(seen).toEqual([
			[0, 10],
			[1, 20],
			[2, 30],
		]);
	});

	it("never exceeds the concurrency limit", async () => {
		const gates = Array.from({ length: 5 }, () => deferred());
		let active = 0;
		let peak = 0;
		const run = runPool(gates, 2, async (gate) => {
			active++;
			peak = Math.max(peak, active);
			await gate.promise;
			active--;
		});
		// Both runners start synchronously and block on their gate, so the peak of 2 is reached before any gate resolves; releasing them lets `run` settle.
		for (const gate of gates) gate.resolve();
		await run;
		expect(peak).toBe(2);
	});

	it("clamps the limit to the item count so it never spawns idle runners", async () => {
		let active = 0;
		let peak = 0;
		await runPool([1, 2], 10, async () => {
			active++;
			peak = Math.max(peak, active);
			await Promise.resolve();
			active--;
		});
		expect(peak).toBeLessThanOrEqual(2);
	});

	it("processes items in claim order when the limit is 1", async () => {
		const order: number[] = [];
		await runPool([5, 6, 7], 1, async (item) => {
			await Promise.resolve();
			order.push(item);
		});
		expect(order).toEqual([5, 6, 7]);
	});

	it("stops claiming new items once shouldCancel turns true", async () => {
		const processed: number[] = [];
		let calls = 0;
		await runPool(
			[1, 2, 3, 4, 5],
			1,
			async (item) => {
				processed.push(item);
				calls++;
			},
			() => calls >= 2,
		);
		expect(processed).toEqual([1, 2]);
	});

	it("runs nothing for an empty item list", async () => {
		let called = false;
		await runPool([], 4, async () => {
			called = true;
		});
		expect(called).toBe(false);
	});
});
