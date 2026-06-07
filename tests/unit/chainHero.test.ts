import { describe, it, expect } from "vitest";
import { ethers } from "ethers";
import { contractFor } from "../../src/chainHero";

// A Contract's `.runner` is typed as the abstract ContractRunner, which has no synchronous network getter; narrow to the concrete JsonRpcProvider we construct it with. The instanceof assertion in the batching test backs this cast for every chain.
function providerOf(chain: string): ethers.JsonRpcProvider {
	return contractFor(chain).runner as ethers.JsonRpcProvider;
}

describe("contractFor", () => {
	it("memoizes one contract instance per chain", () => {
		expect(contractFor("dfkchain")).toBe(contractFor("dfkchain"));
		expect(contractFor("kaia")).toBe(contractFor("kaia"));
	});

	it("returns distinct contracts for distinct chains", () => {
		expect(contractFor("dfkchain")).not.toBe(contractFor("kaia"));
	});

	it("builds a JsonRpcProvider so concurrent getHero calls coalesce into one batched request", () => {
		expect(providerOf("dfkchain")).toBeInstanceOf(ethers.JsonRpcProvider);
	});

	it("pins the DFK Chain network so no eth_chainId round-trip is needed", () => {
		// `_network` resolves synchronously only when a network is pinned at construction via staticNetwork; an unpinned provider defers it to an eth_chainId round-trip, so reading it here both proves the pin and guards against a regression that drops it. Under ethers v6 chainId is a bigint, so the literal must be too.
		const network = providerOf("dfkchain")._network;
		expect(network.chainId).toBe(53935n);
		expect(network.name).toBe("dfkchain");
	});

	it("pins the Kaia network id", () => {
		const network = providerOf("kaia")._network;
		expect(network.chainId).toBe(8217n);
		expect(network.name).toBe("kaia");
	});

	it("falls back to the DFK Chain config for an unknown chain", () => {
		expect(providerOf("bogus")._network.chainId).toBe(53935n);
	});
});
