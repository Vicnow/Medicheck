import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HospitalsService } from './hospitals.service';
import { ReviewsService } from '../reviews/reviews.service';

@Component({
        selector: 'app-hospital-detail',
        standalone: true,
        imports: [CommonModule, RouterLink],
        template: `
    <div class="min-h-screen p-6" style="background: var(--mc-bg); color: var(--mc-ink);">
      <div class="mx-auto max-w-4xl space-y-4">
        <!-- Header -->
        <div class="mc-card">
                <div class="flex items-start gap-4">
  <img
    class="h-16 w-16 rounded-2xl border object-cover"
    [style.borderColor]="'var(--mc-border)'"
    [src]="hs.imageFor(hospital())"
    (error)="onImgError($event)"
    alt="hospital"
  />
  <div class="flex-1">
    <h1 class="mc-h1">{{ hospital()?.name || 'Hospital no encontrado' }}</h1>
    <!-- Agregar el id del hospital aquí -->
    <p class="mc-subtitle" *ngIf="hospital()">
      ID: {{ hospital()!.id }}
    </p>
  </div>
</div>

          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="mc-subtitle" *ngIf="hospital()">
                {{ hospital()!.city }}, {{ hospital()!.state }}
              </p>
              <p class="text-sm mt-2" style="color: var(--mc-muted);" *ngIf="hospital()">
                {{ hospital()!.address }}
              </p>
            </div>

            <a class="mc-btn-ghost" routerLink="/hospitals">Volver</a>
          </div>
        </div>

        <!-- Not found -->
        <div class="mc-card" *ngIf="!hospital()">
          ID inválido.
        </div>

        <!-- Reviews -->
        <div class="mc-card" *ngIf="hospital()">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="font-semibold mc-title">Reseñas</div>
              <div class="text-sm" style="color: var(--mc-muted);">
                Tu reseña se guarda localmente (IndexedDB).
              </div>
            </div>
            <div class="text-xs" style="color: var(--mc-muted);">
              User: {{ userId() }}
            </div>
          </div>

          <!-- Mi reseña -->
          <div class="mt-5 rounded-2xl border p-4" style="border-color: var(--mc-border); background: rgba(226,232,240,.25);">
            <div class="flex items-center justify-between">
              <div class="font-semibold mc-title">Mi reseña</div>
              <div class="text-xs" style="color: var(--mc-muted);">
                {{ mineId() ? 'Editando' : 'Nueva' }}
              </div>
            </div>

            <!-- Rating -->
            <div class="mt-3">
              <div class="mc-label">Calificación</div>
              <div class="flex gap-2">
                <button
                  *ngFor="let s of stars"
                  type="button"
                  class="h-10 w-10 rounded-xl border text-lg"
                  [style.borderColor]="'var(--mc-border)'"
                  [style.background]="s <= rating() ? 'rgba(251,113,133,.15)' : 'var(--mc-card)'"
                  [style.color]="s <= rating() ? 'var(--mc-accent)' : 'var(--mc-muted)'"
                  (click)="setRating(s)"
                  aria-label="star"
                >
                  ★
                </button>
              </div>
            </div>

            <!-- Text -->
            <div class="mt-4">
              <div class="mc-label">Comentario</div>
              <textarea
                class="mc-input"
                rows="4"
                [value]="text()"
                (input)="text.set(($any($event.target)).value)"
                placeholder="Describe tu experiencia (docencia, carga, trato, rotaciones...)"
              ></textarea>
              <div class="mt-2 flex items-center justify-between text-xs" style="color: var(--mc-muted);">
                <span>Mín: {{ minLen }} • Máx: {{ maxLen }}</span>
                <span>{{ (text().trim().length) }}/{{ maxLen }}</span>
                </div>

            </div>

            <!-- Errors / Save -->
            <div class="mt-4 flex items-center justify-between gap-3">
              <div class="text-sm text-rose-600" *ngIf="error()">{{ error() }}</div>
              <button class="mc-btn-primary" (click)="save()" [disabled]="saving()">
                {{ saving() ? 'Guardando…' : (mineId() ? 'Guardar cambios' : 'Guardar reseña') }}
              </button>
            </div>
          </div>

          <!-- Listado -->
          <div class="mt-6">
            <div class="font-semibold mc-title">Todas las reseñas</div>
            <div class="text-sm" style="color: var(--mc-muted);">
              {{ reviews().length }} en este hospital
            </div>

            <div class="mt-4 space-y-3">
              <div class="mc-card" *ngFor="let r of reviews()">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <span class="mc-badge">★ {{ r.rating }}/5</span>
                    <span class="text-xs" style="color: var(--mc-muted);">
                        Dr. {{ r.userId === userId() ? 'Tú' : (r.userName || 'Anónimo') }}
                        </span>

                  </div>
                  <!-- <span class="text-xs" style="color: var(--mc-muted);">
                    {{ r.updatedAt | date:'short' }}
                  </span> -->
                </div>
                <p class="mt-3 text-sm">{{ r.text }}</p>
              </div>

              <div class="mt-2 flex items-center gap-3">
                <span class="mc-badge">★ {{ stats().avg }}/5</span>
                <span class="text-sm" style="color: var(--mc-muted);">{{ stats().count }} reseñas</span>
                 </div>

              <div *ngIf="reviews().length === 0" class="text-sm mt-3" style="color: var(--mc-muted);">
                Aún no hay reseñas. Sé el primero.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class HospitalDetailComponent {
        private route = inject(ActivatedRoute);
        hs = inject(HospitalsService);
        private rs = inject(ReviewsService);

        stars = [1, 2, 3, 4, 5];
        stats = signal<{ count: number; avg: number }>({ count: 0, avg: 0 });
        maxLen = 280;
        minLen = 20;

        hospitalId = this.route.snapshot.paramMap.get('id') || '';
        hospital = computed(() => this.hs.getById(this.hospitalId));

        userId = signal(this.rs.getCurrentUserId());

        // mi reseña (estado local)
        mineId = signal<number | null>(null);
        rating = signal<number>(0);
        text = signal<string>('');
        error = signal<string>('');
        saving = signal<boolean>(false);

        // listado
        reviews = signal<any[]>([]);

        constructor() {
                // load initial
                this.reloadAll().catch(() => { });
        }

        setRating(v: number) {
                this.rating.set(v);
        }

        async reloadAll() {
                if (!this.hospital()) return;

                const mine = await this.rs.getMine(this.hospitalId);
                if (mine) {
                        this.mineId.set(mine.id ?? null);
                        this.rating.set(mine.rating);
                        this.text.set(mine.text);
                } else {
                        this.mineId.set(null);
                        this.rating.set(0);
                        this.text.set('');
                }

                const list = await this.rs.listByHospital(this.hospitalId);
                // orden: más recientes primero
                list.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
                this.reviews.set(list);

                const { count, avg } = await this.rs.statsByHospital(this.hospitalId);
                this.stats.set({ count, avg });

        }

        async save() {
                this.error.set('');
                if (!this.hospital()) return;

                const r = this.rating();
                const t = (this.text() || '').trim();

                if (!(r >= 1 && r <= 5)) { this.error.set('Selecciona un rating (1–5).'); return; }
                if (t.length < this.minLen) { this.error.set(`Escribe al menos ${this.minLen} caracteres.`); return; }
                if (t.length > this.maxLen) { this.error.set(`Máximo ${this.maxLen} caracteres.`); return; }

                try {
                        this.saving.set(true);
                        await this.rs.upsertMine(this.hospitalId, r, t);
                        await this.reloadAll();
                        this.error.set(''); // ok
                } catch (e: any) {
                        this.error.set(e?.message || 'Error guardando reseña');
                } finally {
                        this.saving.set(false);
                }
        }

        onImgError(ev: Event) {
                const img = ev.target as HTMLImageElement;
                img.src = '/assets/hospitals/default.svg';
        }

}
