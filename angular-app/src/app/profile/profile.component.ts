
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
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: any = null;
  loading = false;
  errorMessage = '';

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
      name: [this.user.name || '', Validators.required],
      email: [this.user.email || '', [Validators.required, Validators.email]],
      address: [this.user.address || ''],
      phoneNumbers: this.fb.array([]),
    });

    // Parse existing phones
    let phones: string[] = [];
    try {
      if (Array.isArray(this.user.phone)) phones = this.user.phone;
      else if (
        typeof this.user.phone === 'string' &&
        this.user.phone.trim() !== ''
      )
        phones = JSON.parse(this.user.phone);
    } catch {
      phones = [];
    }

    phones.length ? phones.forEach((p) => this.addPhone(p)) : this.addPhone();
  }

  get phoneNumbers(): FormArray {
    return this.profileForm.get('phoneNumbers') as FormArray;
  }

  addPhone(value: string = '') {
    const phoneControl = this.fb.control(value, [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/),
    ]);
    this.phoneNumbers.push(phoneControl);
  }

  removePhone(index: number) {
    if (this.phoneNumbers.length > 1) this.phoneNumbers.removeAt(index);
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.loading = true;

    const updatedData = {
      ...this.profileForm.value,
      phoneNumbers: this.profileForm.value.phoneNumbers.filter(
        (p: string) => p.trim() !== ''
      ),
    };

    // console.log('📤 Sending profile update:', updatedData);

    this.auth.updateProfile(updatedData).subscribe({
      next: (res) => {
        this.loading = false;

        // Show toast
        this.snackBar.open(' Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        //  Redirect to home after short delay
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        console.error(' Update failed:', err);
        this.errorMessage = err.error?.message || 'Profile update failed';

        //  Error toast
        this.snackBar.open(' Profile update failed', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
