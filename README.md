# DFK Classic Hero Viewer

Browse the transcended hero roster as fully rendered, tavern-style hero cards,
fetched live from chain. Companion app to
[transcended-roster](https://github.com/dfk-classic/transcended-roster).

**Live demo: https://gen-a.dev/dfk-hero-viewer/**

## What it does

- Renders DFK hero cards: composed pixel hero (body,
hair, clothes, weapons), gene-driven background, per-rarity card frames, stats, names
- Controls: show the first N, sample N at random, or look up a specific hero ID
- Click any card's ID to copy it (without the #), paste it into the lookup box to test

All hero data comes from `getHero()` calls against the HeroCore contracts on DFK Chain and Kaia. View functions keep working while the game is paused, so
no API or backend is needed.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5174/. Requires Node 18+.

## Known gaps

Seven classes added after the public hero art set was last updated (berserker, seer, legionnaire, scholar, shapeshifter, bard, spellbow) have no clothing layers yet, so those heroes render in their underwear. The data on their cards is still correct. If the clothing layers become available, they drop into `src/assets/images/hero/` and the renderer picks them up.

## Credits

- Hero rendering is built on [omer-bar/DFK-Hero-Viewer](https://github.com/omer-bar/DFK-Hero-Viewer)(ISC, license included as `LICENSE-DFK-Hero-Viewer.md`), which Kingdom
Studios allowed to use the hero art assets and hero component source.
  Changes here: class tables updated for the newer classes, on-chain fetching re-pointed at DFK Chain and Kaia (the original used Harmony and APIs that no
longer run), missing-asset rendering fixed, click-to-copy IDs added.
- DeFi Kingdoms, its game assets, artwork, and hero designs are the property of Kingdom Studios. This project is community-made and not affiliated with Kingdom Studios.
- Roster data: [dfk-classic/transcended-roster](https://github.com/dfk-classic/transcended-roster)
  (`public/roster.csv` is a copy of that dataset).
