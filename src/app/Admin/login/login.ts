import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
   private authService = inject(AuthService);
  private router = inject(Router);

  loading  = signal(false);
  error    = signal<string | null>(null);
  showPass = signal(false);
    crosses = Array.from({ length: 15 }, (_, i) => i);



  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  get email()    { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  async submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.authService.login(this.email.value!, this.password.value!);
      this.router.navigate(['/admin']);
    } catch (err: any) {
      this.error.set('Login failed: ' + err.code);
    } finally {
      this.loading.set(false);
    }
  }

  async continueWithGoogle() {
    this.loading.set(true);
    this.error.set(null);

    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/admin']);
    } catch (err: any) {
      this.error.set('Google login failed: ' + err.code);
    } finally {
      this.loading.set(false);
    }
  }

}
