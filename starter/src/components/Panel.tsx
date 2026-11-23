import type { Exaggeration, Peak, View } from '../types';

interface Props {
  view: View;
  exaggeration: Exaggeration;
  hillshade: boolean;
  contours: boolean;
  height: number | null;
  peaks: Peak[];
  onView: (view: View) => void;
  onExaggeration: (exaggeration: Exaggeration) => void;
  onHillshade: (on: boolean) => void;
  onContours: (on: boolean) => void;
  onPick: (peak: Peak) => void;
}

const VIEWS: View[] = ['2d', '3d'];
const EXAGGERATIONS: Exaggeration[] = [1, 1.5, 2];

export const Panel = (props: Props) => {
  const { view, exaggeration, hillshade, contours, height, peaks } = props;

  return (
    <aside className="panel" aria-label="Terrain">
      <header>
        <p className="eyebrow">Terrain · hillshade · contours</p>
        <h1>Mount Kenya in 3D</h1>
      </header>

      <div className="controls">
        <div className="field">
          View
          <div className="segments" role="radiogroup" aria-label="View">
            {VIEWS.map((v) => (
              <label key={v} className="segment">
                <input type="radio" name="view" checked={view === v} onChange={() => props.onView(v)} />
                {v.toUpperCase()}
              </label>
            ))}
          </div>
        </div>
        <div className="field">
          Exaggeration
          <div className="segments" role="radiogroup" aria-label="Terrain exaggeration">
            {EXAGGERATIONS.map((x) => (
              <label key={x} className="segment">
                <input
                  type="radio"
                  name="exaggeration"
                  checked={exaggeration === x}
                  disabled={view === '2d'}
                  onChange={() => props.onExaggeration(x)}
                />
                {x}×
              </label>
            ))}
          </div>
        </div>
        <div className="toggles">
          <label className="toggle">
            <input type="checkbox" checked={hillshade} onChange={(e) => props.onHillshade(e.target.checked)} />
            Hillshade
          </label>
          <label className="toggle">
            <input type="checkbox" checked={contours} onChange={(e) => props.onContours(e.target.checked)} />
            Contours
          </label>
        </div>
      </div>

      <div className="count" aria-live="polite">
        <output>{height === null ? '–' : `${Math.round(height).toLocaleString('en-US')} m`}</output>
        <span>{view === '2d' ? 'switch to 3D to read heights' : 'ground height under the cursor'}</span>
      </div>

      <div className="list">
        <h2>Peaks</h2>
        <ol>
          {peaks.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => props.onPick(p)}>
                <b>{p.properties.ele.toLocaleString('en-US')} m</b> {p.properties.name}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <p className="source">Relief: Mapbox Terrain-DEM v1. Contours: Mapbox Terrain v2. Peaks and heights: OpenStreetMap.</p>
    </aside>
  );
};
