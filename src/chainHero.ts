// Fetch a hero straight from chain and shape it with omer-bar's buildHero.
// Routes to the right chain: DFK Chain (Crystalvale) or Kaia (Serendale);
// same getHero struct on both HeroCore diamonds.
import { ethers } from 'ethers';
import buildHero, { type RawNestedHero } from './components/Heroes/HeroInfo/utils/heroes';
import type { Hero } from './types/hero';

const CHAINS: Record<string, { rpc: string; herocore: string }> = {
  dfkchain: {
    rpc: 'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc',
    herocore: '0xEb9B61B145D6489Be575D3603F4a704810e143dF',
  },
  kaia: {
    rpc: 'https://kaia.rpc.defikingdoms.com/',
    herocore: '0x268CC8248FFB72Cd5F3e73A9a20Fa2FF40EfbA61',
  },
};

// prettier-ignore
const heroABI = [
  {"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getHero","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"uint256","name":"summonedTime","type":"uint256"},{"internalType":"uint256","name":"nextSummonTime","type":"uint256"},{"internalType":"uint256","name":"summonerId","type":"uint256"},{"internalType":"uint256","name":"assistantId","type":"uint256"},{"internalType":"uint32","name":"summons","type":"uint32"},{"internalType":"uint32","name":"maxSummons","type":"uint32"}],"internalType":"struct IHeroTypes.SummoningInfo","name":"summoningInfo","type":"tuple"},{"components":[{"internalType":"uint256","name":"statGenes","type":"uint256"},{"internalType":"uint256","name":"visualGenes","type":"uint256"},{"internalType":"enum IHeroTypes.Rarity","name":"rarity","type":"uint8"},{"internalType":"bool","name":"shiny","type":"bool"},{"internalType":"uint16","name":"generation","type":"uint16"},{"internalType":"uint32","name":"firstName","type":"uint32"},{"internalType":"uint32","name":"lastName","type":"uint32"},{"internalType":"uint8","name":"shinyStyle","type":"uint8"},{"internalType":"uint8","name":"class","type":"uint8"},{"internalType":"uint8","name":"subClass","type":"uint8"}],"internalType":"struct IHeroTypes.HeroInfo","name":"info","type":"tuple"},{"components":[{"internalType":"uint256","name":"staminaFullAt","type":"uint256"},{"internalType":"uint256","name":"hpFullAt","type":"uint256"},{"internalType":"uint256","name":"mpFullAt","type":"uint256"},{"internalType":"uint16","name":"level","type":"uint16"},{"internalType":"uint64","name":"xp","type":"uint64"},{"internalType":"address","name":"currentQuest","type":"address"},{"internalType":"uint8","name":"sp","type":"uint8"},{"internalType":"enum IHeroTypes.HeroStatus","name":"status","type":"uint8"}],"internalType":"struct IHeroTypes.HeroState","name":"state","type":"tuple"},{"components":[{"internalType":"uint16","name":"strength","type":"uint16"},{"internalType":"uint16","name":"intelligence","type":"uint16"},{"internalType":"uint16","name":"wisdom","type":"uint16"},{"internalType":"uint16","name":"luck","type":"uint16"},{"internalType":"uint16","name":"agility","type":"uint16"},{"internalType":"uint16","name":"vitality","type":"uint16"},{"internalType":"uint16","name":"endurance","type":"uint16"},{"internalType":"uint16","name":"dexterity","type":"uint16"},{"internalType":"uint16","name":"hp","type":"uint16"},{"internalType":"uint16","name":"mp","type":"uint16"},{"internalType":"uint16","name":"stamina","type":"uint16"}],"internalType":"struct IHeroTypes.HeroStats","name":"stats","type":"tuple"},{"components":[{"internalType":"uint16","name":"strength","type":"uint16"},{"internalType":"uint16","name":"intelligence","type":"uint16"},{"internalType":"uint16","name":"wisdom","type":"uint16"},{"internalType":"uint16","name":"luck","type":"uint16"},{"internalType":"uint16","name":"agility","type":"uint16"},{"internalType":"uint16","name":"vitality","type":"uint16"},{"internalType":"uint16","name":"endurance","type":"uint16"},{"internalType":"uint16","name":"dexterity","type":"uint16"},{"internalType":"uint16","name":"hpSm","type":"uint16"},{"internalType":"uint16","name":"hpRg","type":"uint16"},{"internalType":"uint16","name":"hpLg","type":"uint16"},{"internalType":"uint16","name":"mpSm","type":"uint16"},{"internalType":"uint16","name":"mpRg","type":"uint16"},{"internalType":"uint16","name":"mpLg","type":"uint16"}],"internalType":"struct IHeroTypes.HeroStatGrowth","name":"primaryStatGrowth","type":"tuple"},{"components":[{"internalType":"uint16","name":"strength","type":"uint16"},{"internalType":"uint16","name":"intelligence","type":"uint16"},{"internalType":"uint16","name":"wisdom","type":"uint16"},{"internalType":"uint16","name":"luck","type":"uint16"},{"internalType":"uint16","name":"agility","type":"uint16"},{"internalType":"uint16","name":"vitality","type":"uint16"},{"internalType":"uint16","name":"endurance","type":"uint16"},{"internalType":"uint16","name":"dexterity","type":"uint16"},{"internalType":"uint16","name":"hpSm","type":"uint16"},{"internalType":"uint16","name":"hpRg","type":"uint16"},{"internalType":"uint16","name":"hpLg","type":"uint16"},{"internalType":"uint16","name":"mpSm","type":"uint16"},{"internalType":"uint16","name":"mpRg","type":"uint16"},{"internalType":"uint16","name":"mpLg","type":"uint16"}],"internalType":"struct IHeroTypes.HeroStatGrowth","name":"secondaryStatGrowth","type":"tuple"},{"components":[{"internalType":"uint16","name":"mining","type":"uint16"},{"internalType":"uint16","name":"gardening","type":"uint16"},{"internalType":"uint16","name":"foraging","type":"uint16"},{"internalType":"uint16","name":"fishing","type":"uint16"}],"internalType":"struct IHeroTypes.HeroProfessions","name":"professions","type":"tuple"}],"internalType":"struct IHeroTypes.Hero","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}
];

const contracts: Record<string, ethers.Contract> = {};
function contractFor(chain: string) {
  if (!contracts[chain]) {
    const cfg = CHAINS[chain] || CHAINS.dfkchain;
    const provider = new ethers.providers.StaticJsonRpcProvider(cfg.rpc);
    contracts[chain] = new ethers.Contract(cfg.herocore, heroABI, provider);
  }
  return contracts[chain];
}

export async function fetchHeroOnChain(heroId: string, chain: string = 'dfkchain'): Promise<Hero> {
  const raw = await contractFor(chain).getHero(heroId);
  // buildHero reads both heroRaw.info.firstName and flat heroRaw.firstName;
  // ethers tuples only expose the nested form, so alias the flat fields.
  const heroRaw: RawNestedHero = {
    id: raw.id,
    summoningInfo: raw.summoningInfo,
    info: raw.info,
    state: raw.state,
    stats: raw.stats,
    primaryStatGrowth: raw.primaryStatGrowth,
    secondaryStatGrowth: raw.secondaryStatGrowth,
    professions: raw.professions,
    firstName: raw.info.firstName,
    lastName: raw.info.lastName,
  };
  const hero = buildHero(heroRaw);
  // Dev-only trace of the full built hero (genes holds the complete translation — every stat and visual trait, dominant + r1/r2/r3, named — alongside stats, statGrowth and skills) for cross-checking against the exported dataset; Vite strips this from production builds.
  if (import.meta.env.DEV) {
    console.debug(`hero ${heroId} (${chain}):`, { genes: hero.genes, stats: hero.stats, statGrowth: hero.statGrowth, skills: hero.skills, hero });
  }
  return hero;
}
