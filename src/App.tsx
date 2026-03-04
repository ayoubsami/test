import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

import Header from './components/Header';
import InputPanel from './components/InputPanel';
import MapPicker from './components/MapPicker';
import ResultCards from './components/ResultCards';
import Toast from './components/Toast';
import UnitToggle from './components/UnitToggle';

import { useTheme } from './hooks/useTheme';
import { predict } from './api/predict';
import type { PredictResponse, WindUnit, ToastMessage } from './types';

let toastCounter = 0;

function App() {
  const { theme, toggleTheme } = useTheme();

  // Inputs
  const [day, setDay] = useState<number | null>(null);
  const [hour, setHour] = useState<number>(12);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [hourSelected, setHourSelected] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PredictResponse | null>(null);
  const [windUnit, setWindUnit] = useState<WindUnit>('m/s');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = String(++toastCounter);
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleMapSelect = useCallback((lat: number, lon: number) => {
    setLat(lat);
    setLon(lon);
  }, []);

  const handleOutOfBounds = useCallback(() => {
    addToast('warning', 'Location is outside Morocco bounds (Lat 20–36, Lon −18–0). Please click within the valid area.');
  }, [addToast]);

  const handleHourChange = (h: number) => {
    setHour(h);
    setHourSelected(true);
  };

  const isValid = day !== null && (hourSelected || hour !== null) && lat !== null && lon !== null;

  const handlePredict = async () => {
    if (!isValid || day === null || lat === null || lon === null) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await predict({ day, hour, lat, lon });
      setResults(res);
      addToast('success', 'Prediction complete! Results updated below.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Prediction failed. Check the backend is running.';
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero */}
        <div className="mb-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2"
          >
            Predict Morocco Weather
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto"
          >
            Select a date (Oct 1–5), hour, and location on the map, then run the ML model.
          </motion.p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left panel — inputs */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Input card */}
            <div className="bg-white dark:bg-slate-800/70 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-teal-400 to-emerald-500 inline-block" />
                Date &amp; Time
              </h3>
              <InputPanel
                day={day}
                hour={hour}
                onDayChange={setDay}
                onHourChange={handleHourChange}
              />
            </div>

            {/* Predict button */}
            <motion.button
              onClick={handlePredict}
              disabled={!isValid || loading}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg
                ${isValid && !loading
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 dark:from-teal-600 dark:to-emerald-600 text-white shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02]'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running model…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Predict Weather
                </>
              )}
            </motion.button>

            {!isValid && (
              <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                {!day ? '① Select a day' : !lat ? '② Click on the map' : 'Ready to predict'}
              </p>
            )}
          </div>

          {/* Right panel — map */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800/70 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm h-full">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-blue-400 to-teal-500 inline-block" />
                Location Picker
              </h3>
              <MapPicker
                lat={lat}
                lon={lon}
                onSelect={handleMapSelect}
                onOutOfBounds={handleOutOfBounds}
              />
            </div>
          </div>
        </div>

        {/* Results section */}
        <AnimatePresence>
          {(results || loading) && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-orange-400 to-amber-500 inline-block" />
                  Prediction Results
                </h3>
                <UnitToggle unit={windUnit} onChange={setWindUnit} />
              </div>
              <ResultCards results={results} loading={loading} windUnit={windUnit} />

              {results && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4"
                >
                  Predictions for October {day}, {String(hour).padStart(2, '0')}:00 at {lat?.toFixed(4)}°N, {lon?.toFixed(4)}°E
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
