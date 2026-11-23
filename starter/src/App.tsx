import { useState } from 'react';

import { MapView } from './components/MapView';
import { Panel } from './components/Panel';
import peaks from './data/peaks.json';
import type { Exaggeration, Peak, PeakCollection, View } from './types';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const PEAKS = (peaks as PeakCollection).features;

export const App = () => {
  const [view, setView] = useState<View>('2d');
  const [exaggeration, setExaggeration] = useState<Exaggeration>(1.5);
  const [hillshade, setHillshade] = useState(true);
  const [contours, setContours] = useState(true);
  const [height, setHeight] = useState<number | null>(null);
  const [focus, setFocus] = useState<Peak | null>(null);

  if (!TOKEN) return <p className="message">Add VITE_MAPBOX_TOKEN to a .env file (see .env.example), then restart npm run dev.</p>;

  return (
    <div className="layout">
      <MapView
        token={TOKEN}
        view={view}
        exaggeration={exaggeration}
        hillshade={hillshade}
        contours={contours}
        focus={focus}
        onHeight={setHeight}
      />
      <Panel
        view={view}
        exaggeration={exaggeration}
        hillshade={hillshade}
        contours={contours}
        height={height}
        peaks={PEAKS}
        onView={setView}
        onExaggeration={setExaggeration}
        onHillshade={setHillshade}
        onContours={setContours}
        // A new object each time, so picking the same peak again flies there again.
        onPick={(p) => setFocus({ ...p })}
      />
    </div>
  );
};
