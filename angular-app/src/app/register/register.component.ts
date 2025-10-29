import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

/* Angular Material */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  hidePassword = true;
  hideConfirm = true;

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.snackBar.open('⚠️ Please fill all required fields.', 'Close', {
        duration: 3000,
        panelClass: ['toast-warn'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.snackBar.open('❌ Passwords do not match!', 'Close', {
        duration: 3000,
        panelClass: ['toast-error'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.loading = true;

    const newUser = {
      name: this.name.trim(),
      email: this.email.trim(),
      username: this.username.trim(),
      password: this.password
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        this.loading = false;

        this.snackBar.open('✅ Registration successful!', 'Close', {
          duration: 3000,
          panelClass: ['toast-success'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || 'Registration failed. Please try again.';

        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['toast-error'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}
