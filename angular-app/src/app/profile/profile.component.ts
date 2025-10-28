import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  user: any = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getLoggedInUser();

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    // ✅ Initialize form with existing user data
    this.profileForm = this.fb.group({
      name: [this.user.name || ''],
      email: [this.user.email || ''],
      phone: [this.user.phone || ''],
      address: [this.user.address || '']
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    const updatedData = this.profileForm.value;
    console.log('Sending profile update:', updatedData);

    this.auth.updateProfile(updatedData).subscribe({
      next: (res) => {
        this.loading = false;
        alert('✅ Profile updated successfully!');
        console.log('Server response:', res);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Update failed:', err);
        this.errorMessage = err.error?.message || 'Profile update failed';
      }
    });
  }
}
