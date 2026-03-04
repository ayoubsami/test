// Shared TypeScript types for Morocco Weather Predictor

export interface PredictRequest {
    day: number;
    hour: number;
    lat: number;
    lon: number;
}

export interface PredictResponse {
    temperature: number;
    wind: number;
    precipitation: number;
}

export type WindUnit = 'm/s' | 'km/h';

export type Theme = 'dark' | 'light';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning';
    message: string;
}
