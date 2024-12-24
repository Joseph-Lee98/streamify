import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const loggedOutGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true; // Allow access
  } else {
    router.navigate(['/']); // Redirect to home
    alert('You are already logged in.');
    return false; // Deny access
  }
};
