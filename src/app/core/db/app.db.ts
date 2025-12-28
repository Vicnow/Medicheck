import Dexie, { Table } from 'dexie';

export type ReviewEntity = {
        id?: number;          // autoincrement
        hospitalId: string;
        userId: string;       // fake user
        rating: number;       // 1..5
        text: string;
        createdAt: number;
        updatedAt: number;
};

export class AppDb extends Dexie {
        reviews!: Table<ReviewEntity, number>;

        constructor() {
                super('medicheck_db');

                // Indexes:
                // - hospitalId, userId para "mi reseña" rápida
                // - hospitalId para listar reseñas de hospital
                this.version(1).stores({
                        reviews: '++id, hospitalId, userId, [hospitalId+userId], updatedAt',
                });
        }
}

export const db = new AppDb();
