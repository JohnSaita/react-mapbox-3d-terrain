import type { Peak } from '../types';

const metres = (m: number) => `${Math.round(m).toLocaleString('en-US')} m`;

/** Popup content for one peak. Built from text nodes, so nothing in the data runs as HTML. */
export const peakPopup = (peak: Peak, terrain: number | null): HTMLElement => {
  const p = peak.properties;
  const el = document.createElement('div');
  el.className = 'popup';
  el.appendChild(document.createElement('h2')).textContent = p.name;
  const rows: [string, string][] = [
    ['OSM', metres(p.ele)],
    ['Terrain', terrain === null ? '–' : metres(terrain)],
  ];
  for (const [label, value] of rows) {
    const row = el.appendChild(document.createElement('p'));
    row.appendChild(document.createElement('b')).textContent = label;
    row.append(` ${value}`);
  }
  const link = el.appendChild(document.createElement('a'));
  link.href = `https://www.openstreetmap.org/${p.osm}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'OpenStreetMap';
  return el;
};
