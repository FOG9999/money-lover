import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../storage.service';
import { CONSTS } from '../../../consts';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {
    constructor(
        private localStorage: LocalStorageService,
        private router: Router
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(this.localStorage.get("user") && this.localStorage.get("user").token){
            let level = this.localStorage.get("user").level;
            if(level == CONSTS.auth.USER){
                return true;
            }
            else {
                const url: UrlTree = this.router.parseUrl("/auth/login");
                return url;
            }
        }
        else {
            const url: UrlTree = this.router.parseUrl("/auth/login");
            return url;
        };
    }
    
}