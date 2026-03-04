import { type FC } from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';

interface InputPanelProps {
    day: number | null;
    hour: number | null;
    onDayChange: (d: number) => void;
    onHourChange: (h: number) => void;
}

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);


const InputPanel: FC<InputPanelProps> = ({ day, hour, onDayChange, onHourChange }) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Month (locked) */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Month
                </label>
                <div className="relative">
                    <div className="w-full px-3 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-between cursor-not-allowed select-none">
                        <span>October</span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-semibold tracking-wide">
                            FIXED
                        </span>
                    </div>
                </div>
            </div>

            {/* Day selector */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Day <span className="text-slate-400 dark:text-slate-500 font-normal">(1–31)</span>
                </label>
                <div className="relative">
                    <select
                        value={day ?? ''}
                        onChange={e => onDayChange(Number(e.target.value))}
                        className="w-full appearance-none px-3 py-2.5 pr-9 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-teal-400 dark:hover:border-teal-600"
                    >
                        <option value="" disabled>Select day…</option>
                        {DAYS.map(d => (
                            <option key={d} value={d}>
                                October {d}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    Note: The ML model was primarily trained on data for October 1–5.
                </p>
            </div>

            {/* Hour selector */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Hour
                    </span>
                    {hour !== null && (
                        <span className="text-teal-600 dark:text-teal-400 font-bold tabular-nums">
                            {String(hour).padStart(2, '0')}:00
                        </span>
                    )}
                </label>
                <input
                    type="range"
                    min={0}
                    max={23}
                    step={1}
                    value={hour ?? 0}
                    onChange={e => onHourChange(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-teal-500 dark:accent-teal-400 bg-slate-200 dark:bg-slate-700"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono px-0.5">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:00</span>
                </div>

                {/* Hour quick selectors */}
                <div className="grid grid-cols-4 gap-1.5 mt-1">
                    {[0, 6, 12, 18].map(h => (
                        <button
                            key={h}
                            onClick={() => onHourChange(h)}
                            className={`py-1 rounded-lg text-xs font-semibold transition-all duration-150
                ${hour === h
                                    ? 'bg-teal-500 dark:bg-teal-600 text-white shadow-sm shadow-teal-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400'
                                }`}
                        >
                            {String(h).padStart(2, '0')}h
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InputPanel;
