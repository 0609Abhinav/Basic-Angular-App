import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('700ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  user: any = null;
  loading = true;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 🔹 Restore session from local storage
    this.auth.restoreSession();
    this.user = this.auth.getLoggedInUser();

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    // 🔹 Get updated user profile from backend
    this.auth.getProfile().subscribe({
      next: (res) => {
        this.user = this.normalizeUser(res);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to fetch profile:', err);
        this.loading = false;
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  /**
   * 🧩 Normalize user data to ensure phone numbers display properly
   */
  normalizeUser(user: any) {
    if (!user) return { phone: [] };

    let phoneArray: string[] = [];

    if (user.phone) {
      try {
        // Handle when MySQL returns double-encoded JSON like "[\"123\"]"
        let raw = user.phone;

        if (typeof raw === 'string') {
          raw = raw.trim();

          // Try to parse once
          let parsed = JSON.parse(raw);

          // If parsed itself is a stringified JSON, parse again
          if (typeof parsed === 'string' && parsed.startsWith('[')) {
            parsed = JSON.parse(parsed);
          }

          phoneArray = Array.isArray(parsed) ? parsed : [String(parsed)];
        } else if (Array.isArray(raw)) {
          phoneArray = raw;
        } else {
          phoneArray = [String(raw)];
        }
      } catch {
        console.warn('⚠️ Failed to parse phone field:', user.phone);
        phoneArray = [String(user.phone)];
      }
    }

    return { ...user, phone: phoneArray };
  }

  /**
   * 🧭 Navigate to profile page
   */
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * 🚪 Logout user
   */
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
