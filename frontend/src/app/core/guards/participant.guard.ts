import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const participantGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionId = sessionStorage.getItem('sessionId');
  const participantId = sessionStorage.getItem('participantId');

  if (sessionId && participantId) {
    return true;
  }

  const code = route.queryParams['code'];
  if (code) {
    router.navigate(['/join'], { queryParams: { code } });
  } else {
    router.navigate(['/join']);
  }
  return false;
};
