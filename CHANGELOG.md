# Changelog

Notable changes to this project. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Vitest unit suite covering gene decoding (dominant and recessive slots, plus short-value left-padding), hero building, stamina/XP math, name lookups, all five rarity tiers, summon cost, and stat-gene class/subClass/element decoding.
- TypeScript strict mode across the codebase, with every resulting error fixed rather than suppressed.
- Keyboard and screen-reader support on the hero card: the tab bar, the flip toggle, and click-to-copy on the hero ID all work without a mouse.
- A bounded concurrency pool for loading hero batches, so a large roster no longer fires thousands of requests at once.

### Changed
- Upgraded ethers from v5.7.2 to v6.16.0. Switched to native bigint, a single `JsonRpcProvider` that batches by default, and networks pinned at construction so the provider skips the `eth_chainId` round-trip.
- Pulled repeated card and stat markup into shared pieces: `StatTab`, `StatColumn`, `GeneRow`, `StatBar`, `SpecialsRow`, `IconBadge`, and a `capPercent` helper. Trait icons and profession rows are now data-driven instead of hand-written one row at a time.
- Concurrent `getHero` calls now coalesce into a single batched JSON-RPC request.
- Centralised the zero address behind a shared `ZERO_ADDRESS` constant and gave the summon-cost constants clearer names.
- CI now runs on Node 24, replacing the end-of-life Node 20.

### Fixed
- The roster reports a load failure now instead of sitting on the loading screen forever.
- Chain values split on CRLF, so names stay clean when the data was authored on Windows.
- Remaining stamina clamps at zero for recharge times far in the future, rather than going negative.
- The lockfile installs cleanly on Linux as well as Windows. It was missing the two pure-JS `@emnapi` runtime fallbacks that Linux resolves, so `npm ci` failed in CI while passing locally.

### Performance
- Split ethers and React into their own vendor chunks for better caching.
- Dropped the `classnames` dependency in favour of a native class join, along with four other unused runtime dependencies.
- Memoised the hero card tab pages and keyed cards by stable hero ID, which stops the remount thrash that happened when heroes loaded out of order.

### Removed
- Dead commented-out code: stale SVG imports in the limb and hair layers, and leftover `props.base` lines.
