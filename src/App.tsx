import React, { useEffect, useRef, useState } from 'react';
import HeroCard from './components/Heroes/HeroCard';
import { fetchHeroOnChain } from './chainHero';
import { loadRoster, samplePicks } from './roster';
import { MIN_COUNT, MAX_COUNT, clampCount } from './countBounds';
import { runPool } from './runPool';
import type { RosterEntry } from './roster';
import type { Hero } from './types/hero';

// How many hero fetches run against the chain at once. The viewer reads from a shared public RPC, so this caps in-flight requests to stay polite while still loading a batch far faster than the old one-at-a-time walk.
const LOAD_CONCURRENCY = 6;

const btn: React.CSSProperties = {
  background: '#1d2330', color: '#e9e4d8', border: '1px solid #2e3850',
  padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
};
const inp: React.CSSProperties = {
  background: '#141821', color: '#e9e4d8', border: '1px solid #2e3850',
  padding: '7px 10px', borderRadius: 8, fontSize: 13,
};

export default function App() {
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [count, setCount] = useState(8);
  const [lookupId, setLookupId] = useState('');
  const [status, setStatus] = useState('loading roster…');
  const runRef = useRef(0); // cancels an in-flight batch when a new one starts

  useEffect(() => {
    loadRoster(() => fetch(import.meta.env.BASE_URL + 'roster.csv').then(r => r.text()))
      .then(({ entries, status: loadStatus }) => {
        setRoster(entries);
        setStatus(loadStatus);
      });
  }, []);

  async function loadBatch(entries: RosterEntry[], label: string) {
    const run = ++runRef.current;
    setHeroes([]);
    // Results land in roster-position slots so out-of-order completions still render in roster order; `loaded` counts successes for the status line.
    const slots: (Hero | undefined)[] = Array.from({ length: entries.length });
    let loaded = 0;
    const isStale = () => runRef.current !== run; // a newer batch superseded this one
    await runPool(entries, LOAD_CONCURRENCY, async (e, i) => {
      try {
        const h = await fetchHeroOnChain(e.id, e.chain);
        if (isStale()) return;
        slots[i] = h;
        loaded++;
        setHeroes(slots.filter((x): x is Hero => x !== undefined));
        setStatus(`${label}: ${loaded}/${entries.length} loaded from chain…`);
      } catch (err: unknown) {
        if (isStale()) return;
        // Dev-only trace; the user-facing failure is surfaced via setStatus below. Vite strips this from production builds.
        if (import.meta.env.DEV) console.error(e.id, err);
        const message = err instanceof Error ? err.message : String(err);
        setStatus(`hero ${e.id} (${e.chain}) failed: ${message.slice(0, 90)}`);
      }
    }, isStale);
    if (isStale()) return;
    setStatus(`${label}: ${loaded} heroes, live from chain.`);
  }

  const firstN = () => loadBatch(roster.slice(0, count), `first ${count}`);
  const randomN = () => loadBatch(samplePicks(roster, count), `random ${count}`);
  const lookup = () => {
    const id = lookupId.trim();
    if (!id) return;
    const entry = roster.find(e => e.id === id);
    loadBatch([entry ?? { id, chain: 'dfkchain' }], `hero ${id}`);
  };

  return (
    <div>
      <h1>DFK Classic: Transcended Hero Viewer</h1>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', margin: '10px 0 6px' }}>
        <label style={{ fontSize: 13, color: '#8b93a3' }}>show</label>
        <input style={{ ...inp, width: 64 }} type="number" min={MIN_COUNT} max={MAX_COUNT} value={count}
               onChange={e => setCount(clampCount(e.target.value))} />
        <button style={btn} onClick={firstN} disabled={!roster.length}>First {count}</button>
        <button style={btn} onClick={randomN} disabled={!roster.length}>Random {count}</button>
        <span style={{ width: 14 }} />
        <input style={{ ...inp, width: 170 }} placeholder="hero ID…" value={lookupId}
               onChange={e => setLookupId(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && lookup()} />
        <button style={btn} onClick={lookup}>Look up</button>
        <button style={{ ...btn, color: '#8b93a3' }} onClick={() => { runRef.current++; setHeroes([]); setStatus('cleared.'); }}>Clear</button>
      </div>
      <div style={{ color: '#8b93a3', fontSize: 12, marginBottom: 14 }}>{status}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
        {heroes.map((h, i) => (
          <div key={(h.id?.toString?.() ?? i) + '-' + i}>
            <HeroCard hero={h} flipToggle />
          </div>
        ))}
      </div>
    </div>
  );
}
