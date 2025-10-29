import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/* Angular Material modules used in template */
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/* Your Auth service */
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: any = null;
  loading = false;
  errorMessage = '';
  readonly MAX_PHONES = 5;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getLoggedInUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileForm = this.fb.group({
      name: [this.user.name || '', [Validators.required, Validators.minLength(3)]],
      email: [this.user.email || '', [Validators.required, Validators.email]],
      address: [this.user.address || ''],
      phoneNumbers: this.fb.array([]),
    });

    this.loadPhoneNumbers();
  }

  get phoneNumbers(): FormArray {
    return this.profileForm.get('phoneNumbers') as FormArray;
  }

  addPhone(value: string = ''): void {
    if (this.phoneNumbers.length >= this.MAX_PHONES) {
      this.snackBar.open('You can add up to 5 phone numbers only.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    const phoneControl = this.fb.control(value, [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/),
    ]);
    this.phoneNumbers.push(phoneControl);
  }

  removePhone(index: number): void {
    if (this.phoneNumbers.length > 1) {
      this.phoneNumbers.removeAt(index);
    }
  }

  private loadPhoneNumbers(): void {
    let phones: string[] = [];
    try {
      if (Array.isArray(this.user.phone)) {
        phones = this.user.phone;
      } else if (typeof this.user.phone === 'string' && this.user.phone.trim() !== '') {
        phones = JSON.parse(this.user.phone);
      }
    } catch {
      phones = [];
    }
    phones.length ? phones.forEach((p) => this.addPhone(p)) : this.addPhone();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.snackBar.open('Please fix form errors before submitting.', 'Close', {
        duration: 2500,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    this.loading = true;

    const updatedData = {
      ...this.profileForm.value,
      phoneNumbers: this.profileForm.value.phoneNumbers.filter(
        (p: string) => p && p.trim() !== ''
      ),
    };

    this.auth.updateProfile(updatedData).subscribe({
      next: () => {
        this.loading = false;
        localStorage.setItem('user', JSON.stringify({ ...this.user, ...updatedData }));

        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        setTimeout(() => this.router.navigate(['/home']), 1000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Profile update failed', err);
        this.errorMessage = err?.error?.message || 'Profile update failed';

        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
