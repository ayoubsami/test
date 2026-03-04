
import type { WindUnit } from '../types';

interface UnitToggleProps {
    unit: WindUnit;
    onChange: (u: WindUnit) => void;
}

function UnitToggle({ unit, onChange }: UnitToggleProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Wind Unit:</span>
            <div className="relative flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                {(['m/s', 'km/h'] as WindUnit[]).map(u => (
                    <button
                        key={u}
                        onClick={() => onChange(u)}
                        className={`relative z-10 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200
              ${unit === u
                                ? 'bg-teal-500 dark:bg-teal-600 text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                    >
                        {u}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default UnitToggle;
