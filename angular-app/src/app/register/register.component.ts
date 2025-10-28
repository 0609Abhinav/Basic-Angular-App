import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';

  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: any) {
    console.log('Form submitted'); //  Debug log
    this.submitted = true;
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = ' Please fill in all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = ' Passwords do not match!';
      return;
    }

    this.loading = true;

    const newUser = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
    };

    console.log('Submitting user:', newUser); //  Debug log

    this.authService.register(newUser).subscribe({
      next: () => {
        this.loading = false;
        alert(' Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || '❌ Registration failed. Please try again.';
      },
    });
  }
}
