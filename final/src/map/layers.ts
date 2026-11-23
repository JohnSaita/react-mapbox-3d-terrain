import type { ExpressionSpecification, LayerSpecification, SourceSpecification } from 'mapbox-gl';

export const STYLE = 'mapbox://styles/mapbox/light-v11';

/** Raster elevation tiles (metres). One source for the 3D terrain, one for the hillshade. */
export const DEM = 'mapbox-dem';
export const HILLSHADE_DEM = 'hillshade-dem';
export const demSource: SourceSpecification = {
  type: 'raster-dem',
  url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
  tileSize: 512,
  maxzoom: 14,
};

/** Vector tiles with contour lines: `ele` in metres, `index` marks every 5th and 10th line. */
export const CONTOURS = 'contours';
export const contourSource: SourceSpecification = { type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' };
/** The layer inside that tileset that holds the lines. Its name, exactly as the tileset spells it. */
export const CONTOUR_LAYER = 'contour';

export const PEAKS = 'peaks';

export const hillshadeLayer: LayerSpecification = {
  id: 'hillshade',
  type: 'hillshade',
  source: HILLSHADE_DEM,
  paint: {
    'hillshade-exaggeration': 0.6,
    'hillshade-shadow-color': '#3d4a5c',
    'hillshade-accent-color': '#3d4a5c',
  },
};

const isIndex: ExpressionSpecification = ['>=', ['get', 'index'], 5];

export const contourLines: LayerSpecification = {
  id: 'contour-lines',
  type: 'line',
  source: CONTOURS,
  'source-layer': CONTOUR_LAYER,
  paint: {
    'line-color': '#a0703a',
    'line-opacity': ['case', isIndex, 0.85, 0.45],
    'line-width': ['case', isIndex, 1.4, 0.6],
  },
};

export const contourLabels: LayerSpecification = {
  id: 'contour-labels',
  type: 'symbol',
  source: CONTOURS,
  'source-layer': CONTOUR_LAYER,
  // Label only the index lines (every 5th and 10th), not every line.
  filter: isIndex,
  layout: {
    'symbol-placement': 'line',
    'text-field': ['concat', ['number-format', ['get', 'ele'], { locale: 'en-US' }], ' m'],
    'text-size': 11,
    'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
  },
  paint: { 'text-color': '#7a4f22', 'text-halo-color': 'rgba(255, 255, 255, 0.85)', 'text-halo-width': 1.2 },
};

export const PEAK_DOTS = 'peak-dots';

export const peakDots: LayerSpecification = {
  id: PEAK_DOTS,
  type: 'circle',
  source: PEAKS,
  paint: {
    'circle-radius': 5,
    'circle-color': '#ee6a35',
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': 1.5,
    // Stand up from the terrain instead of lying flat on the slope.
    'circle-pitch-alignment': 'viewport',
  },
};

export const peakLabels: LayerSpecification = {
  id: 'peak-labels',
  type: 'symbol',
  source: PEAKS,
  layout: {
    'text-field': ['concat', ['get', 'name'], '\n', ['number-format', ['get', 'ele'], { locale: 'en-US' }], ' m'],
    'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
    'text-size': 13,
    'text-offset': [0, 0.8],
    'text-anchor': 'top',
  },
  paint: { 'text-color': '#0b2e5c', 'text-halo-color': '#ffffff', 'text-halo-width': 1.6 },
};
