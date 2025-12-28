import { Injectable } from '@angular/core';
import { db } from '../../core/db/app.db';
import type { Review } from './reviews.model';

const USER_ID_KEY = 'mc_user_id';

// MVP: user fake persistente
function getOrCreateUserId(): string {
        const existing = localStorage.getItem(USER_ID_KEY);
        if (existing) return existing;

        const id = 'u_' + Math.random().toString(36).slice(2);
        localStorage.setItem(USER_ID_KEY, id);
        return id;
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
        private userId = getOrCreateUserId();

        getCurrentUserId() {
                return this.userId;
        }

        async listByHospital(hospitalId: string): Promise<Review[]> {
                return db.reviews
                        .where('hospitalId')
                        .equals(hospitalId)
                        .reverse() // usa index updatedAt al final si quieres; aquí ok
                        .toArray();
        }

        async getMine(hospitalId: string): Promise<Review | null> {
                const r = await db.reviews
                        .where('[hospitalId+userId]')
                        .equals([hospitalId, this.userId])
                        .first();
                return r ?? null;
        }

        async upsertMine(hospitalId: string, rating: number, text: string): Promise<void> {
                // validaciones mínimas
                const cleanText = (text ?? '').trim();
                const cleanRating = Number(rating);

                if (!(cleanRating >= 1 && cleanRating <= 5)) throw new Error('Rating inválido');
                if (!cleanText) throw new Error('Texto requerido');

                const now = Date.now();
                const existing = await this.getMine(hospitalId);

                if (!existing) {
                        await db.reviews.add({
                                hospitalId,
                                userId: this.userId,
                                rating: cleanRating,
                                text: cleanText,
                                createdAt: now,
                                updatedAt: now,
                        });
                        return;
                }

                await db.reviews.update(existing.id!, {
                        rating: cleanRating,
                        text: cleanText,
                        updatedAt: now,
                });
        }

        async statsByHospital(hospitalId: string): Promise<{ count: number; avg: number }> {
                const list = await this.listByHospital(hospitalId);
                const count = list.length;
                if (count === 0) return { count: 0, avg: 0 };
                const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
                const avg = Math.round((sum / count) * 10) / 10;
                return { count, avg };
        }
}
