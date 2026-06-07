// Summoning cost model, in JEWEL-equivalent tears.
const BASE_SUMMON_COST = 6;
const COST_PER_HERO_SUMMONED = 2;
const COST_PER_GENERATION = 10;

// Generation-0 (genesis) heroes are capped; later generations scale without a ceiling.
const GENESIS_GENERATION = 0;
const GENESIS_COST_CAP = 30;

/**
 * Compute the cost to summon a new hero from a given summoner.
 *
 * @param summonerGen - Generation of the summoning hero (0 = genesis).
 * @param totalHeroesAlreadySummoned - How many heroes the summoner has already produced.
 * @returns The summon cost, capped at {@link GENESIS_COST_CAP} for genesis summoners only.
 */
export const calculateHeroSummonCost = (summonerGen: number, totalHeroesAlreadySummoned: number): number => {
	const totalCost =
		BASE_SUMMON_COST +
		COST_PER_HERO_SUMMONED * totalHeroesAlreadySummoned +
		COST_PER_GENERATION * summonerGen;

	if (summonerGen === GENESIS_GENERATION && totalCost > GENESIS_COST_CAP) {
		return GENESIS_COST_CAP;
	}

	return totalCost;
};
