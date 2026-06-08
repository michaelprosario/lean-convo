import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, RegisterData, AuthResponse } from '../models/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenSignal = signal<string | null>(sessionStorage.getItem('accessToken'));
  private readonly userNameSignal = signal<string | null>(sessionStorage.getItem('displayName'));

  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly displayName = computed(() => this.userNameSignal() || 'User');
  readonly token = computed(() => this.tokenSignal());

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          sessionStorage.setItem('accessToken', res.data.accessToken);
          sessionStorage.setItem('userId', res.data.userId);
          sessionStorage.setItem('displayName', res.data.displayName);
          sessionStorage.setItem('email', res.data.email);

          this.tokenSignal.set(res.data.accessToken);
          this.userNameSignal.set(res.data.displayName);
        }
      })
    );
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post('/auth/create-account', data);
  }

  logout(): void {
    sessionStorage.clear();
    this.tokenSignal.set(null);
    this.userNameSignal.set(null);
    this.router.navigate(['/']);
  }
}
