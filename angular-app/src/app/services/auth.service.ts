


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // 🔹 Holds the current user and allows reactive updates
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  //  Register user
  register(userData: any): Observable<any> {
    console.log('Sending data to backend:', userData);
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  //  Login user
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token && res.user) {
          this.saveUserSession(res.token, res.user);
          this.userSubject.next(res.user); //  Update subscribers
        }
      })
    );
  }

  //  Get profile (requires token)
  getProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
      tap((profile: any) => {
        // Update stored user when fetched
        this.saveUserSession(localStorage.getItem('token')!, profile);
        this.userSubject.next(profile);
      })
    );
  }

updateProfile(data: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.patch(`${this.apiUrl}/profile/update`, data, { headers }).pipe(
    tap(() => {
      const updatedUser = { ...this.getLoggedInUser(), ...data };
      this.saveUserSession(localStorage.getItem('token')!, updatedUser);
      this.userSubject.next(updatedUser);
    })
  );
}


  //  Save token and user info
  saveUserSession(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  //  Get current user snapshot
  getLoggedInUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Restore user session on reload
  restoreSession(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      // console.log('Session restored for:', parsed);
      this.userSubject.next(parsed); //  Broadcast restored user
    }
  }

  //  Logout user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  //  Check if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  //  Private helper to attach token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }
}
