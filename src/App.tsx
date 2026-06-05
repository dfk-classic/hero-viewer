import React, { useEffect, useRef, useState } from 'react';
import HeroCard from './components/Heroes/HeroCard';
import { fetchHeroOnChain } from './chainHero';

type RosterEntry = { id: string; chain: string };

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
  const [heroes, setHeroes] = useState<any[]>([]);
  const [count, setCount] = useState(8);
  const [lookupId, setLookupId] = useState('');
  const [status, setStatus] = useState('loading roster…');
  const runRef = useRef(0); // cancels an in-flight batch when a new one starts

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'roster.csv').then(r => r.text()).then(t => {
      const entries = t.trim().split('\n').slice(1).map(l => {
        const [id, chain] = l.split(',');
        return { id, chain };
      });
      setRoster(entries);
      setStatus(`roster loaded: ${entries.length.toLocaleString()} transcended heroes. Pick a sample.`);
    });
  }, []);

  async function loadBatch(entries: RosterEntry[], label: string) {
    const run = ++runRef.current;
    setHeroes([]);
    const out: any[] = [];
    for (const e of entries) {
      if (runRef.current !== run) return; // newer batch started
      try {
        const h = await fetchHeroOnChain(e.id, e.chain);
        out.push(h);
        if (runRef.current !== run) return;
        setHeroes([...out]);
        setStatus(`${label}: ${out.length}/${entries.length} loaded from chain…`);
      } catch (err: any) {
        console.error(e.id, err);
        setStatus(`hero ${e.id} (${e.chain}) failed: ${String(err?.message).slice(0, 90)}`);
      }
    }
    setStatus(`${label}: ${out.length} heroes, live from chain.`);
  }

  const firstN = () => loadBatch(roster.slice(0, count), `first ${count}`);
  const randomN = () => {
    const picks: RosterEntry[] = [];
    const used = new Set<number>();
    while (picks.length < Math.min(count, roster.length)) {
      const i = Math.floor(Math.random() * roster.length);
      if (!used.has(i)) { used.add(i); picks.push(roster[i]); }
    }
    loadBatch(picks, `random ${count}`);
  };
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
        <input style={{ ...inp, width: 64 }} type="number" min={1} max={60} value={count}
               onChange={e => setCount(Math.max(1, Math.min(60, Number(e.target.value) || 1)))} />
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
