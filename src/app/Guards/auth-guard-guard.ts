import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
 const auth   = inject(Auth);
  const router = inject(Router);

  const user = auth.currentUser;

  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false; 
  }
};
