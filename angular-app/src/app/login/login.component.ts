import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/* Angular Material Imports */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  rememberMe = false;
  loading = false;
  errorMessage = '';
  hidePassword = true; //  Fix for your template

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials = { username: this.username, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.loading = false;

        //  Show success toast
        this.snackBar.open(' Login successful!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['toast-success']
        });

        // Save token and user
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || '❌ Login failed. Please try again.';

        // Show error toast
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['toast-error']
        });
      }
    });
  }
}
