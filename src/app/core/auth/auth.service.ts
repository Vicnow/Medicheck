import { Injectable } from '@angular/core';

type Session = { token: string; exp: number };
const STORAGE_KEY = 'mc_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
        login(email: string, password: string): boolean {
                if (!email?.trim() || !password?.trim()) return false;

                const token = 'fake-jwt-' + Math.random().toString(36).slice(2);
                const exp = Date.now() + 8 * 60 * 60 * 1000; // 8h
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, exp } satisfies Session));
                return true;
        }

        logout(): void {
                localStorage.removeItem(STORAGE_KEY);
        }

        isAuthenticated(): boolean {
                return !!this.getSession();
        }

        getToken(): string | null {
                const s = this.getSession();
                return s ? s.token : null;
        }

        private getSession(): Session | null {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return null;

                try {
                        const s = JSON.parse(raw) as Session;
                        if (!s?.token || !s?.exp) return null;

                        if (Date.now() > s.exp) {
                                this.logout();
                                return null;
                        }
                        return s;
                } catch {
                        this.logout();
                        return null;
                }
        }
}
