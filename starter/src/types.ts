import type { Feature, FeatureCollection, Point } from 'geojson';

/** The OpenStreetMap tags this app reads for each peak. */
export interface PeakProps {
  name: string;
  /** The peak's `ele` tag in OpenStreetMap, in metres. */
  ele: number;
  /** The OSM object, for example node/294560693. */
  osm: string;
}

export type Peak = Feature<Point, PeakProps>;
export type PeakCollection = FeatureCollection<Point, PeakProps>;

export type View = '2d' | '3d';
export type Exaggeration = 1 | 1.5 | 2;
