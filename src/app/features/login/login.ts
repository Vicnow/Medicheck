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
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h1 class="text-xl font-semibold">Login</h1>

        <form class="mt-4 space-y-3" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div>
            <label class="block text-sm text-slate-300 mb-1">Email</label>
            <input class="w-full text-slate-300 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
              formControlName="email" type="email" placeholder="you@domain.com" />
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Password</label>
            <input class="w-full text-slate-300 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2"
              formControlName="password" type="password" placeholder="123" />
          </div>

          <p class="text-sm text-red-400" *ngIf="error">{{ error }}</p>

          <button class="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-2 disabled:opacity-50"
            type="submit" [disabled]="form.invalid">
            Entrar
          </button>

          <a class="block text-center text-sm text-slate-300 hover:text-slate-100" routerLink="/hospitals">
            Ir a Hospitals
          </a>
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
