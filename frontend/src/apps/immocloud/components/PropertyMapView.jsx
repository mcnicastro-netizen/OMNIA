/* OMNIA — Property Map View (M3.S3)
 *
 * Leaflet + OpenStreetMap map for the B2C ImmobilCloud search page.
 * Receives an array of lightweight markers (id, lat, lng, price, operation,
 * property_type, city, title) and renders them as clickable pins with a popup
 * that links to the public detail page (M3.S4 — coming soon).
 *
 * Center: Rome by default; auto-fits bounds to markers when present.
 */
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons broken by Webpack (Leaflet default behavior)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = [41.9028, 12.4964]; // Rome
const DEFAULT_ZOOM = 6;

function formatPrice(m) {
  const v = m.operation === "rent" ? m.rent_monthly : m.price;
  if (!v) return "";
  return m.operation === "rent"
    ? `€ ${Number(v).toLocaleString("it-IT")}/mese`
    : `€ ${Number(v).toLocaleString("it-IT")}`;
}

/* FitBounds — internal helper that re-centers the map when markers change */
function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (!markers || markers.length === 0) return;
    const valid = markers.filter((m) => m.lat && m.lng);
    if (valid.length === 0) return;
    const bounds = L.latLngBounds(valid.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [markers, map]);
  return null;
}

export default function PropertyMapView({ markers = [] }) {
  const { t } = useTranslation();
  const mapRef = useRef(null);

  const valid = markers.filter((m) => m.lat && m.lng);

  return (
    <div data-testid="property-map-view" className="relative">
      {valid.length === 0 && (
        <div
          data-testid="map-empty-hint"
          className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] bg-white/95 border border-stone-200 rounded-full px-4 py-1.5 text-xs text-stone-700 shadow-sm"
        >
          {t("cloud.map_empty")}
        </div>
      )}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-[600px] w-full rounded-lg border border-stone-200"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={valid} />
        {valid.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <div data-testid={`map-popup-${m.id}`} className="min-w-[180px]">
                <div className="text-sm font-medium text-stone-900 mb-1">
                  {m.title || m.property_type}
                </div>
                <div className="text-xs text-stone-600 mb-1">
                  {m.city}{m.property_type ? ` · ${m.property_type}` : ""}
                </div>
                <div className="text-sm text-[#0B1E3F] font-semibold">
                  {formatPrice(m)}
                </div>
                <a
                  href={`/it/cloud/property/${m.id}`}
                  data-testid={`map-popup-link-${m.id}`}
                  className="text-xs uppercase tracking-widest text-[#C19A6B] hover:underline mt-2 inline-block"
                >
                  {t("cloud.view_detail")} →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
