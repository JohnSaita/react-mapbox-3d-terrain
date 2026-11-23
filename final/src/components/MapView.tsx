import mapboxgl, { type LngLatLike } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

import peaks from '../data/peaks.json';
import {
  CONTOURS, contourLabels, contourLines, contourSource, DEM, demSource, HILLSHADE_DEM, hillshadeLayer,
  PEAK_DOTS, peakDots, peakLabels, PEAKS, STYLE,
} from '../map/layers';
import { peakPopup } from '../map/popup';
import type { Exaggeration, Peak, PeakCollection, View } from '../types';

const ATTRIBUTION = 'Peaks: © OpenStreetMap contributors.';
const TILT = { pitch: 62, bearing: -25 };
const popup = new mapboxgl.Popup({ offset: 12, maxWidth: '260px' });

interface Props {
  token: string;
  view: View;
  exaggeration: Exaggeration;
  hillshade: boolean;
  contours: boolean;
  focus: Peak | null;
  onHeight: (metres: number | null) => void;
}

export const MapView = ({ token, view, exaggeration, hillshade, contours, focus, onHeight }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      accessToken: token,
      style: STYLE,
      center: [37.309, -0.153],
      zoom: 12.2,
      customAttribution: ATTRIBUTION,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      map.addSource(DEM, demSource);
      map.addSource(HILLSHADE_DEM, demSource);
      map.addSource(CONTOURS, contourSource);
      map.addSource(PEAKS, { type: 'geojson', data: peaks as PeakCollection });

      // Draw the relief under the basemap's labels, not over them.
      const firstLabel = map.getStyle()?.layers?.find((layer) => layer.type === 'symbol')?.id;
      map.addLayer(hillshadeLayer, firstLabel);
      map.addLayer(contourLines, firstLabel);
      map.addLayer(contourLabels);
      map.addLayer(peakDots);
      map.addLayer(peakLabels);
      setReady(true);
    });

    map.on('mousemove', (e) => onHeight(heightAt(map, e.lngLat)));
    map.on('mouseout', () => onHeight(null));
    map.on('click', PEAK_DOTS, (e) => {
      const peak = e.features?.[0] as Peak | undefined;
      if (peak) showPopup(map, peak);
    });
    map.on('mouseenter', PEAK_DOTS, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', PEAK_DOTS, () => (map.getCanvas().style.cursor = ''));

    return () => {
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [token, onHeight]);

  // 3D: drape the map over the elevation tiles. 2D: take the terrain away.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setTerrain(view === '3d' ? { source: DEM, exaggeration } : null);
  }, [ready, view, exaggeration]);

  // Tilt the camera for 3D: looking straight down, relief is hard to see.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.easeTo({ ...(view === '3d' ? TILT : { pitch: 0, bearing: 0 }), duration: 2200 });
  }, [ready, view]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setLayoutProperty(hillshadeLayer.id, 'visibility', hillshade ? 'visible' : 'none');
    for (const layer of [contourLines, contourLabels]) {
      map.setLayoutProperty(layer.id, 'visibility', contours ? 'visible' : 'none');
    }
  }, [ready, hillshade, contours]);

  // Fly to the peak picked in the panel, then open its popup.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    map.flyTo({ center: focus.geometry.coordinates as LngLatLike, zoom: 13.6, duration: 3000 });
    map.once('moveend', () => showPopup(map, focus));
  }, [focus]);

  return <div ref={containerRef} className="map" />;
};

/** Height of the ground in metres, or null in 2D. The raw DEM value, whatever the exaggeration. */
const heightAt = (map: mapboxgl.Map, lngLat: LngLatLike) => map.queryTerrainElevation(lngLat, { exaggerated: false }) ?? null;

const showPopup = (map: mapboxgl.Map, peak: Peak) => {
  const at = peak.geometry.coordinates as LngLatLike;
  popup.setLngLat(at).setDOMContent(peakPopup(peak, heightAt(map, at))).addTo(map);
};
