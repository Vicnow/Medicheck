import type { Review } from './reviews.model';

export type ReviewsStats = { count: number; avg: number };

export function calcStats(reviews: Review[]): ReviewsStats {
        const count = reviews.length;
        if (count === 0) return { count: 0, avg: 0 };

        const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
        const avg = Math.round((sum / count) * 10) / 10; // 1 decimal
        return { count, avg };
}

export function starsFill(avg: number): number[] {
        // devuelve 5 valores 1/0 para pintar estrellas "llenas"
        const full = Math.floor(avg);
        const half = avg - full >= 0.5 ? 1 : 0;
        const arr = Array(5).fill(0);
        for (let i = 0; i < full && i < 5; i++) arr[i] = 1;
        if (half && full < 5) arr[full] = 1; // MVP: sin half real, lo tratamos como full visual
        return arr;
}
