import React from 'react';
import { Thermometer, Wind, CloudRain, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PredictResponse, WindUnit } from '../types';

interface ResultCardsProps {
    results: PredictResponse | null;
    loading: boolean;
    windUnit: WindUnit;
}

const SkeletonCard: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col gap-4"
    >
        <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-16 h-3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
        <div className="space-y-2">
            <div className="w-24 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="w-16 h-3 rounded-full bg-slate-100 dark:bg-slate-700/50 animate-pulse" />
        </div>
    </motion.div>
);

function formatWindValue(ms: number, unit: WindUnit): string {
    if (unit === 'km/h') return (ms * 3.6).toFixed(1);
    return ms.toFixed(1);
}

const cardConfig = [
    {
        key: 'temperature' as keyof PredictResponse,
        label: 'Temperature',
        icon: Thermometer,
        getUnit: (_: WindUnit) => '°C',
        gradient: 'from-orange-400 to-red-500',
        gradientDark: 'dark:from-orange-500 dark:to-red-600',
        bgLight: 'bg-orange-50',
        bgDark: 'dark:bg-orange-900/20',
        borderLight: 'border-orange-100',
        borderDark: 'dark:border-orange-800/30',
        textColor: 'text-orange-600 dark:text-orange-400',
        iconBg: 'bg-gradient-to-br from-orange-400 to-red-500',
        format: (v: number, _: WindUnit) => v.toFixed(1),
        description: 'Air temperature at surface',
    },
    {
        key: 'wind' as keyof PredictResponse,
        label: 'Wind Speed',
        icon: Wind,
        getUnit: (u: WindUnit) => u,
        gradient: 'from-blue-400 to-cyan-500',
        gradientDark: 'dark:from-blue-500 dark:to-cyan-600',
        bgLight: 'bg-blue-50',
        bgDark: 'dark:bg-blue-900/20',
        borderLight: 'border-blue-100',
        borderDark: 'dark:border-blue-800/30',
        textColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
        format: formatWindValue,
        description: 'Surface wind magnitude',
    },
    {
        key: 'precipitation' as keyof PredictResponse,
        label: 'Precipitation',
        icon: CloudRain,
        getUnit: (_: WindUnit) => 'mm',
        gradient: 'from-teal-400 to-emerald-500',
        gradientDark: 'dark:from-teal-500 dark:to-emerald-600',
        bgLight: 'bg-teal-50',
        bgDark: 'dark:bg-teal-900/20',
        borderLight: 'border-teal-100',
        borderDark: 'dark:border-teal-800/30',
        textColor: 'text-teal-600 dark:text-teal-400',
        iconBg: 'bg-gradient-to-br from-teal-400 to-emerald-500',
        format: (v: number, _: WindUnit) => v.toFixed(2),
        description: 'Precipitation amount',
    },
];

const ResultCards: React.FC<ResultCardsProps> = ({ results, loading, windUnit }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 0.1, 0.2].map((d, i) => <SkeletonCard key={i} delay={d} />)}
            </div>
        );
    }

    if (!results) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AnimatePresence>
                {cardConfig.map((card, i) => {
                    const Icon = card.icon;
                    const rawValue = results[card.key];
                    const displayValue = card.format(rawValue, windUnit);
                    const unit = card.getUnit(windUnit);

                    return (
                        <motion.div
                            key={card.key}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
                            className={`relative overflow-hidden rounded-2xl p-5 border
                bg-white dark:bg-slate-800/80
                ${card.borderLight} ${card.borderDark}
                shadow-sm hover:shadow-lg transition-shadow duration-300
                group cursor-default`}
                        >
                            {/* Background gradient blob */}
                            <div
                                className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 dark:opacity-20 blur-2xl bg-gradient-to-br ${card.gradient} ${card.gradientDark}`}
                            />

                            {/* Icon + label row */}
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shadow-md`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <TrendingUp className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-400 transition-colors" />
                            </div>

                            {/* Value */}
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-1.5">
                                    <span className={`text-3xl font-bold tabular-nums ${card.textColor}`}>
                                        {displayValue}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                                        {unit}
                                    </span>
                                </div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {card.label}
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                    {card.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default ResultCards;
