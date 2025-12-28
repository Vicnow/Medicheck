import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
        selector: 'app-login',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterLink],
        template: `
        <div class="mc-page">
                <div class="mc-shell">
                        <h1 class="mc-h1">Medicheck</h1>
                        <p class="mc-subtitle">Reseñas reales de hospitales. Sin ruido.</p>

                        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
                                <div>
                                <label class="mc-label">Email</label>
                                <input class="mc-input" formControlName="email" type="email" placeholder="you@domain.com" />
                                </div>

                                <div>
                                <label class="mc-label">Password</label>
                                <input class="mc-input" formControlName="password" type="password" placeholder="123" />
                                </div>

                                <p class="text-sm text-rose-600" *ngIf="error">{{ error }}</p>

                                <button class="mc-btn-primary w-full" type="submit" [disabled]="form.invalid">
                                Entrar
                                </button>

                                <p class="text-xs text-slate-500">
                                MVP: token fake + guard. Luego se reemplaza por auth real.
                                </p>
                        </form>
                </div>
        </div>
        `,

})
export class LoginComponent {
        private fb = inject(FormBuilder);
        private auth = inject(AuthService);
        private router = inject(Router);
        private route = inject(ActivatedRoute);

        error = '';

        form = this.fb.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(3)]],
        });

        onSubmit() {
                this.error = '';
                const { email, password } = this.form.getRawValue();

                const ok = this.auth.login(email!, password!);
                if (!ok) {
                        this.error = 'Credenciales inválidas (MVP).';
                        return;
                }

                const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/hospitals';
                this.router.navigateByUrl(returnUrl);
        }
}
