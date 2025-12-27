import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HospitalsService } from './hospitals.service';

@Component({
        selector: 'app-hospitals',
        standalone: true,
        imports: [CommonModule, FormsModule, RouterLink],
        template: `
    <div class="min-h-screen p-6">
      <div class="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div class="flex items-center justify-between gap-3">
          <h1 class="text-xl font-semibold">Hospitals</h1>

          <div class="flex items-center gap-2">
            <a class="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm" routerLink="/login">Login</a>
            <button class="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm" (click)="logout()">
              Logout
            </button>
          </div>
        </div>

        <!-- Filtros -->
        <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-sm text-slate-300 mb-1">Buscar</label>
            <input
              class="w-full text-slate-300 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
              [(ngModel)]="q"
              placeholder="Nombre..."
            />
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Estado</label>
            <select
              class="w-full text-slate-300 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
              [(ngModel)]="state"
            >
              <option value="">Todos</option>
              <option *ngFor="let s of hs.states()" [value]="s">{{ s }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Ciudad</label>
            <select
              class="w-full text-slate-300 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
              [(ngModel)]="city"
            >
              <option value="">Todas</option>
              <option *ngFor="let c of hs.cities()" [value]="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <!-- Lista -->
        <div class="mt-6 space-y-3">
          <a
            *ngFor="let h of filtered()"
            class="block rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-950/70 p-4"
            [routerLink]="['/hospitals', h.id]"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-medium">{{ h.name }}</div>
                <div class="text-sm text-slate-300">{{ h.city }}, {{ h.state }}</div>
                <div class="text-xs text-slate-400 mt-1">{{ h.address }}</div>
              </div>
              <div class="text-xs text-slate-300 flex gap-2 flex-wrap justify-end">
                <span *ngFor="let t of (h.tags || [])" class="px-2 py-1 rounded-lg bg-slate-800">{{ t }}</span>
              </div>
            </div>
          </a>

          <div *ngIf="filtered().length === 0" class="text-slate-300 text-sm">
            Sin resultados.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HospitalsComponent {
        private auth = inject(AuthService);
        private router = inject(Router);
        hs = inject(HospitalsService);

        // filtros (simple)
        q = '';
        state = '';
        city = '';

        filtered = computed(() => {
                const q = this.q.trim().toLowerCase();
                const state = this.state.trim().toLowerCase();
                const city = this.city.trim().toLowerCase();

                return this.hs.all().filter(h => {
                        const matchesQ = !q || h.name.toLowerCase().includes(q);
                        const matchesState = !state || h.state.toLowerCase() === state;
                        const matchesCity = !city || h.city.toLowerCase() === city;
                        return matchesQ && matchesState && matchesCity;
                });
        });

        logout() {
                this.auth.logout();
                this.router.navigate(['/login']);
        }
}
