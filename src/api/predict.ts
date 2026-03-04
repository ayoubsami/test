import axios, { isAxiosError } from 'axios';
import type { PredictRequest, PredictResponse } from '../types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sami0026-nasaweither.hf.space',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30_000,
});

export async function predict(payload: PredictRequest): Promise<PredictResponse> {
    try {
        const { data } = await api.post('/predict', payload);

        let temp = 0;
        let wind = 0;
        let precip = 0;

        if (data && typeof data === 'object') {
            if ('temp' in data) {
                temp = Number(data.temp) || 0;
                wind = Number(data.wind) || 0;
                precip = Number(data.precip) || 0;
            } else if ('temperature' in data) {
                temp = Number(data.temperature) || 0;
                wind = Number(data.wind) || 0;
                precip = Number(data.precipitation || data.precip) || 0;
            } else if ('prediction' in data && Array.isArray(data.prediction)) {
                [temp, wind, precip] = data.prediction.map((v: unknown) => Number(v) || 0);
            } else if (Array.isArray(data)) {
                [temp, wind, precip] = data.map((v: unknown) => Number(v) || 0);
            } else {
                throw new Error('Unexpected response format from backend.');
            }
        } else {
            throw new Error('Invalid response from backend.');
        }

        return {
            temperature: temp,
            wind: wind,
            precipitation: precip
        };
    } catch (err: unknown) {
        if (isAxiosError(err)) {
            if (err.response?.status === 422 || err.response?.status === 400) {
                const detail = err.response.data?.detail || JSON.stringify(err.response.data);
                throw new Error(`Validation Error: ${detail}`);
            }
            throw new Error(err.response?.data?.detail || err.message || 'Network error occurred connecting to backend.');
        }
        throw err;
    }
}

export async function healthCheck(): Promise<boolean> {
    try {
        const { data } = await api.get('/');
        return data?.status === 'ok';
    } catch {
        return false;
    }
}
