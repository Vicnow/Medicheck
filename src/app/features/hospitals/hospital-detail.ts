import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HospitalsService } from './hospitals.service';

@Component({
        selector: 'app-hospital-detail',
        standalone: true,
        imports: [CommonModule, RouterLink],
        template: `
    <div class="min-h-screen p-6">
      <div class="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h1 class="text-xl font-semibold">{{ hospital?.name || 'Hospital no encontrado' }}</h1>
            <p class="text-sm text-slate-300" *ngIf="hospital">
              {{ hospital.city }}, {{ hospital.state }}
            </p>
          </div>

          <div class="flex gap-2">
            <a class="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm" routerLink="/hospitals">
              Volver
            </a>
          </div>
        </div>

        <div class="mt-6 space-y-3" *ngIf="hospital; else notFound">
          <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div class="text-sm text-slate-300">Dirección</div>
            <div class="mt-1">{{ hospital.address }}</div>
          </div>

          <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div class="text-sm text-slate-300">Tags</div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span *ngFor="let t of (hospital.tags || [])" class="px-2 py-1 rounded-lg bg-slate-800 text-sm">{{ t }}</span>
              <span *ngIf="(hospital.tags || []).length === 0" class="text-sm text-slate-400">—</span>
            </div>
          </div>

          <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div class="text-sm text-slate-300">Reseñas</div>
            <div class="mt-1 text-slate-400 text-sm">
              Placeholder. En el Paso 3/6 conectamos Reviews (crear/listar por hospital).
            </div>
          </div>
        </div>

        <ng-template #notFound>
          <div class="mt-6 text-slate-300">
            ID inválido.
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class HospitalDetailComponent {
        private route = inject(ActivatedRoute);
        private hs = inject(HospitalsService);

        hospital = (() => {
                const id = this.route.snapshot.paramMap.get('id') || '';
                return this.hs.getById(id);
        })();
}
