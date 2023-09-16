import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/authentication.service';
import { LocalStorageService, PassportLoginService, randomString } from '@shared';
import { Annonymous, CONSTS } from 'app/consts';
import { GoogleUser } from 'app/model/user.model';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'redirect',
    templateUrl: 'redirect.component.html'
})

export class RedirectComponent implements OnInit, OnDestroy {
    constructor(
        private passportService: PassportLoginService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private localStorage: LocalStorageService,
        private router: Router,
        private toastService: ToastrService
    ) {
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
            switch (params['method']) {
                case 'github':
                    if(params['access_token']){
                        this.handleLoginGithub(params['access_token'])
                    }
                    else {
                        this.toastService.error("Đăng nhập thất bại. Vui lòng thử lại");
                        this.router.navigateByUrl('/auth/login');
                    }
                    break;
                case 'google': {
                    try {                        
                        this.handleLoginGoogle(params);
                    } catch (error) {
                        this.toastService.error("Đăng nhập thất bại. Vui lòng thử lại");
                        this.router.navigateByUrl('/auth/login');
                    }
                    break;
                }
                default:
                    this.router.navigateByUrl('/auth/login');
                    break;
            }
        })
    }

    private access_token: string;
    private destroy$ = new Subject();

    ngOnInit() {

    }

    private handleLoginGoogle(user: Partial<GoogleUser>){
        const systemUser: {
            username: string,
            password: string,
            firstname: string,
            lastname: string,
            email: string,
            level: 'ADMIN' | 'SYSTEM' | 'USER',
            authId: number | string,
            avatar: string
        } = {
            username: user.email,
            email: user.email,
            firstname: user.family_name,
            lastname: user.given_name,
            level: "USER",
            password: randomString(),
            authId: user.sub,
            avatar: user.picture
        };
        this.createUserOAuth(systemUser);
    }

    private handleLoginGithub(access_token: string){
        this.access_token = access_token;
        this.passportService.getGithubUserByToken(this.access_token).subscribe(user => {
            const systemUser: {
                username: string,
                password: string,
                firstname: string,
                lastname: string,
                email: string,
                level: 'ADMIN' | 'SYSTEM' | 'USER',
                authId: number | string
            } = {
                username: user.login,
                email: user.email || Annonymous,
                firstname: user.name || user.login,
                lastname: randomString(false, 5),
                level: "USER",
                password: randomString(),
                authId: user.id
            };
            this.createUserOAuth(systemUser);
        })
    }

    private createUserOAuth(systemUser: {
        username: string,
        password: string,
        firstname: string,
        lastname: string,
        email: string,
        level: 'ADMIN' | 'SYSTEM' | 'USER',
        authId: number | string
    }){
        this.authService.createUserOAuth({ ...systemUser })
        .subscribe(res => {
            if (res && res._id) {
                this.localStorage.set('user', res);
                if (res.level === CONSTS.auth.ADMIN || res.level === CONSTS.auth.SYSTEM) {
                    this.router.navigateByUrl('/money-lover/admin');
                }
                else {
                    this.router.navigateByUrl('/money-lover/');
                }
                this.toastService.success("Đăng nhập thành công. Đang chuyển hướng")
            }
            else {
                this.toastService.error("Đăng nhập thất bại. Vui lòng thử lại");
            }
        }, err => {
            this.toastService.error("Đăng nhập thất bại. Vui lòng thử lại");
            this.router.navigateByUrl('/auth/login');
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}