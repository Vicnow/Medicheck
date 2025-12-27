import { Injectable, computed, signal } from '@angular/core';
import { Hospital, HOSPITALS_SEED } from './hospitals.seed';

@Injectable({ providedIn: 'root' })
export class HospitalsService {
        private hospitals = signal<Hospital[]>(HOSPITALS_SEED);

        all = computed(() => this.hospitals());

        states = computed(() => {
                const set = new Set(this.hospitals().map(h => h.state));
                return [''].concat([...set].sort());
        });

        cities = computed(() => {
                const set = new Set(this.hospitals().map(h => h.city));
                return [''].concat([...set].sort());
        });

        getById(id: string): Hospital | null {
                return this.hospitals().find(h => h.id === id) ?? null;
        }
}
