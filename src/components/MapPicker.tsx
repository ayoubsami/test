
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons with bundler
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Morocco bounds
const LAT_MIN = 20, LAT_MAX = 36;
const LON_MIN = -18, LON_MAX = 0;
const MOROCCO_CENTER: [number, number] = [31.7917, -7.0926];

// Custom teal marker
const tealIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapPickerProps {
    lat: number | null;
    lon: number | null;
    onSelect: (lat: number, lon: number) => void;
    onOutOfBounds: () => void;
}

// Inner component to capture map click events
function ClickHandler({
    onSelect,
    onOutOfBounds,
}: {
    onSelect: (lat: number, lon: number) => void;
    onOutOfBounds: () => void;
}) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            if (lat < LAT_MIN || lat > LAT_MAX || lng < LON_MIN || lng > LON_MAX) {
                onOutOfBounds();
            } else {
                onSelect(lat, lng);
            }
        },
    });
    return null;
}

function MapPicker({ lat, lon, onSelect, onOutOfBounds }: MapPickerProps) {
    const hasSelection = lat !== null && lon !== null;

    return (
        <div className="flex flex-col gap-3">
            {/* Map container */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
                <MapContainer
                    center={MOROCCO_CENTER}
                    zoom={5}
                    style={{ height: '320px', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickHandler onSelect={onSelect} onOutOfBounds={onOutOfBounds} />
                    {hasSelection && (
                        <Marker position={[lat!, lon!]} icon={tealIcon}>
                            <Popup>
                                <span className="font-semibold">Selected Location</span>
                                <br />
                                Lat: {lat!.toFixed(5)}&nbsp;|&nbsp;Lon: {lon!.toFixed(5)}
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Bounds overlay indicator */}
                <div className="absolute bottom-2 right-2 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-mono">
                    Bounds: Lat [20–36] · Lon [–18–0]
                </div>
            </div>

            {/* Lat/Lon display */}
            <div className="grid grid-cols-2 gap-3">
                {(['Latitude', 'Longitude'] as const).map((label, i) => {
                    const value = i === 0 ? lat : lon;
                    return (
                        <div key={label} className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" />
                                {label}
                            </label>
                            <div
                                className={`w-full px-3 py-2.5 rounded-xl text-sm font-mono border transition-all duration-200
                  ${hasSelection
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                                    }`}
                            >
                                {value !== null ? value.toFixed(5) : '—'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!hasSelection && (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    Click on the map to select a location within Morocco
                </p>
            )}
        </div>
    );
}

export default MapPicker;
