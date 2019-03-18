import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'app/api.service';
import { AuthGuard } from './auth.guard';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private api: ApiService, private router: Router, private authGuard: AuthGuard) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.authGuard.canActivate(next, state)) return false;
      if (this.api.role() === 'ADMIN') return true;
      this.router.navigateByUrl('/unauthorized');
      return false;
  }

}
