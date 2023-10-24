import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/authentication.service';
import { REGEX } from 'app/consts';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'forgot-password',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnDestroy {
    constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService) { 
        this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
            if(params['t'] && params['email'] && new RegExp(REGEX.EMAIL, 'i').test(params['email'])){
                this.authService.validatePForgotPassRequest({email: params['email'], t: params['t']}).subscribe((res) => {
                    this.newPassword = res.np;
                    this.loading = false;
                }, err => {
                    this.router.navigateByUrl('/error/403');    
                })
            }
            else {
                this.router.navigateByUrl('/error/403');
            }
        })
    }

    newPassword: string = "";
    loading: boolean = true;
    private destroy$ = new Subject<boolean>();

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}