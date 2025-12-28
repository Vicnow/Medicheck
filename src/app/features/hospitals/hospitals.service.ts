import { Injectable, computed, signal } from '@angular/core';
import { Hospital, HOSPITALS_SEED, DEFAULT_HOSPITAL_IMAGE } from './hospitals.seed';

@Injectable({ providedIn: 'root' })
export class HospitalsService {
        private hospitals = signal<Hospital[]>(HOSPITALS_SEED);

        all = computed(() => this.hospitals());

        states = computed(() => {
                return [...new Set(this.hospitals().map(h => h.state))].sort();
        });

        cities = computed(() => {
                return [...new Set(this.hospitals().map(h => h.city))].sort();
        });


        getById(id: string): Hospital | null {
                return this.hospitals().find(h => h.id === id) ?? null;
        }

        imageFor(h: Hospital | null): string {
                return h?.image || DEFAULT_HOSPITAL_IMAGE;
        }
}
