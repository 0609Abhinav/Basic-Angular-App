import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // corrected (was styleUrl)
})
export class HomeComponent implements OnInit {
  user: any = null;
  loading = true;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Try to restore session
    this.auth.restoreSession();
    this.user = this.auth.getLoggedInUser();

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    //  Fetch latest data from backend (so updated phone/address appear instantly)
    this.auth.getProfile().subscribe({
      next: (res) => {
        this.user = res;
        localStorage.setItem('user', JSON.stringify(res)); // refresh stored session
        this.loading = false;
      },
      error: (err) => {
        console.error(' Failed to fetch profile:', err);
        this.loading = false;
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  // Navigate to Edit Profile
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  //  Logout and redirect
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
