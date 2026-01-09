import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HospitalsService } from './hospitals.service';
import { ReviewsService } from '../reviews/reviews.service';

function norm(s: string): string {
        return (s ?? '')
                .toString()
                .trim()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, ''); // quita acentos
}


@Component({
        selector: 'app-hospitals',
        standalone: true,
        imports: [CommonModule, FormsModule, RouterLink],
        template: `
        <div class="min-h-screen p-6" style="background: var(--mc-bg); color: var(--mc-ink);">
                <div class="mx-auto ">
                        <div class="flex items-center justify-between gap-3">
                                <div>
                                <h1 class="mc-h1">Hospitales</h1>
                                <p class="mc-subtitle">Busca por nombre, estado o ciudad.</p>
                                </div>

                                <button class="mc-btn-ghost" (click)="logout()">Salir</button>
                        </div>

                        <!-- Filtros -->
                        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                <label class="mc-label">Buscar</label>
                                <input
  class="mc-input"
  [ngModel]="q()"
  (ngModelChange)="q.set($event); onFiltersChanged()"
  placeholder="Ej: general, cdmx, guadalajara..."
/>

                                </div>

                                <div>
                                <label class="mc-label">Estado</label>
                                <select class="mc-input" [ngModel]="state()" (ngModelChange)="state.set($event); onFiltersChanged()">
                                <option value="">Todos</option>
                                <option *ngFor="let s of hs.states()" [value]="s">{{ s }}</option>
                                </select>

                                </div>

                                <div>
                                <label class="mc-label">Ciudad</label>
                               <select class="mc-input" [ngModel]="city()" (ngModelChange)="city.set($event); onFiltersChanged()">
                                <option value="">Todas</option>
                                <option *ngFor="let c of hs.cities()" [value]="c">{{ c }}</option>
                                </select>

                                </div>
                        </div>

                <!-- Lista -->
                        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <a *ngFor="let h of filtered()"
                                class="mc-card block"
                                [routerLink]="['/hospitals', h.id]">
                                <div class="flex items-start gap-4">
                                <img
                                class="h-14 w-14 rounded-2xl border object-cover"
                                [style.borderColor]="'var(--mc-border)'"
                                [src]="hs.imageFor(h)"
                                (error)="onImgError($event)"
                                alt="hospital"
                                />

                                <div class="flex-1 flex items-start justify-between gap-3">
                                <div>
                                <div class="font-semibold" style="font-family: 'Plus Jakarta Sans', Inter, sans-serif;">
                                        {{ h.name }}
                                </div>
                                <div class="text-sm" style="color: var(--mc-muted);">
                                        {{ h.city }}, {{ h.state }}
                                </div>
                                <div class="text-xs mt-1" style="color: var(--mc-muted);">
                                        {{ h.address }}
                                </div>
                                </div>

                                <div class="flex flex-wrap gap-2 justify-end">
                                <span *ngFor="let t of (h.tags || [])" class="mc-badge">{{ t }}</span>
                                </div>
                                </div>
                                </div>
                        <div class="flex items-start justify-between gap-3">
                        <div>
                        
                        <div class="text-left mt-2">
                                <div class="text-sm font-semibold" style="color: var(--mc-ink);">
                                ★ {{ ( 0) }}
                                </div>
                                <div class="text-xs" style="color: var(--mc-muted);">
                                {{ ( 0) }} reseñas
                                </div>
                         </div>
                        </div>
                        </div>
                        </a>
                </div>

                <div *ngIf="filtered().length === 0" class="mt-6 text-sm" style="color: var(--mc-muted);">
                        Sin resultados.
                </div>
                </div>
        </div>
        `,

})
export class HospitalsComponent {

        onImgError(ev: Event) {
                const img = ev.target as HTMLImageElement;
                img.src = '/assets/hospitals/default.svg';
        }

        onFiltersChanged() {
                // debounce super básico
                console.log('filters changed');
                clearTimeout((this as any)._t);
                (this as any)._t = setTimeout(() => this.loadStatsForVisible(), 150);
        }

        constructor() {
                setTimeout(() => this.loadStatsForVisible(), 0);
        }

        private auth = inject(AuthService);
        private router = inject(Router);
        hs = inject(HospitalsService);
        rs = inject(ReviewsService);

        statsMap = signal<Record<string, { count: number; avg: number }>>({});

        // filtros (simple)
        q = signal<string>('');
        state = signal<string>('');
        city = signal<string>('');


        filtered = computed(() => {
                const q = norm(this.q());
                const state = norm(this.state());
                const city = norm(this.city());

                return this.hs.all().filter(h => {
                        const haystack = norm([
                                h.name,
                                h.state,
                                h.city,
                                h.address,
                                ...(h.tags || []),
                        ].join(' '));

                        const matchesQ = !q || haystack.includes(q);
                        const matchesState = !state || norm(h.state) === state;
                        const matchesCity = !city || norm(h.city) === city;

                        return matchesQ && matchesState && matchesCity;
                });
        });


        logout() {
                this.auth.logout();
                this.router.navigate(['/login']);
        }

        async loadStatsForVisible() {
                const current = { ...this.statsMap() };
                const visible = this.filtered().slice(0, 20); // MVP: solo primeros 20
                for (const h of visible) {
                        if (current[h.id]) continue;
                        current[h.id] = await this.rs.statsByHospital(h.id);
                }
                this.statsMap.set(current);
        }

}
