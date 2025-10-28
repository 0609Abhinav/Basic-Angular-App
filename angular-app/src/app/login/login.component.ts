// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Router } from '@angular/router';
// import { AuthService } from '../auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule], //  Added RouterModule
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username = '';
//   password = '';
//   rememberMe = false;
//   loading = false;
//   errorMessage = '';

//   constructor(private auth: AuthService, private router: Router) {}

//   ngOnInit() {
//     // Redirect if already logged in
//     if (this.auth.isLoggedIn()) {
//       this.router.navigate(['/home']);
//     }
//   }

//   onSubmit() {
//     this.loading = true;
//     this.errorMessage = '';

//     this.auth.login(this.username, this.password, this.rememberMe).subscribe({
//       next: () => {
//         this.loading = false;
//         alert(' Login successful!');
//         this.router.navigate(['/home']);
//       },
//       error: err => {
//         this.loading = false;
//         this.errorMessage = err.message || ' Login failed';
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; //  make sure path matches your service

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // 🔹 Redirect if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    // 🔹 Prepare credentials for backend
    const credentials = { username: this.username, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.loading = false;
        alert(' Login successful!');

        // 🔹 Save token and user info
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        // 🔹 Optional: remember login
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || ' Login failed. Please try again.';
      }
    });
  }
}
