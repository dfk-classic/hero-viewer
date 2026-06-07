import { describe, it, expect } from "vitest";
import { ethers } from "ethers";
import { contractFor } from "../../src/chainHero";

// `.provider` is typed as the abstract Provider, which has no synchronous network getter; narrow to the concrete batch provider we construct. The instanceof assertion in the first test backs this cast for every chain.
function providerOf(chain: string): ethers.providers.JsonRpcBatchProvider {
	const { provider } = contractFor(chain);
	return provider as ethers.providers.JsonRpcBatchProvider;
}

describe("contractFor", () => {
	it("memoizes one contract instance per chain", () => {
		expect(contractFor("dfkchain")).toBe(contractFor("dfkchain"));
		expect(contractFor("kaia")).toBe(contractFor("kaia"));
	});

	it("returns distinct contracts for distinct chains", () => {
		expect(contractFor("dfkchain")).not.toBe(contractFor("kaia"));
	});

	it("builds a batching provider so concurrent getHero calls coalesce into one request", () => {
		expect(providerOf("dfkchain")).toBeInstanceOf(ethers.providers.JsonRpcBatchProvider);
	});

	it("pins the DFK Chain network so no eth_chainId round-trip is needed", () => {
		// `_network` is populated synchronously only when a network is pinned at construction; an unpinned provider leaves `network` undefined until an eth_chainId round-trip resolves, so reading it here both proves the pin and guards against a regression that drops it.
		const network = providerOf("dfkchain").network;
		expect(network.chainId).toBe(53935);
		expect(network.name).toBe("dfkchain");
	});

	it("pins the Kaia network id", () => {
		const network = providerOf("kaia").network;
		expect(network.chainId).toBe(8217);
		expect(network.name).toBe("kaia");
	});

	it("falls back to the DFK Chain config for an unknown chain", () => {
		expect(providerOf("bogus").network.chainId).toBe(53935);
	});
});
