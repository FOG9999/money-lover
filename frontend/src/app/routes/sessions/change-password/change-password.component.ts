import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/authentication/authentication.service';
import { validators } from '@shared/utils/validators';
import { CONSTS, REGEX } from 'app/consts';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'change-password',
    templateUrl: 'change-password.component.html',
    styleUrls: ['change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit, OnDestroy {
    constructor(private router: Router, private activedRouter: ActivatedRoute, private authService: AuthService, private toastService: ToastrService) { 
        this.activedRouter.queryParams.pipe(takeUntil(this.destroy$)).subscribe(res => {
            if(res['t'] && res['email'] && new RegExp(REGEX.EMAIL, 'i').test(res['email'])){
                this.authService.checkChangepasswordUrl({email: res['email'], t: res['t']}).subscribe(() => {
                    this.token = res['t'];
                    this.email = res['email'];
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
    errors = CONSTS.messages.changePassword;
    private token: string = "";
    private email: string = "";
    private destroy$ = new Subject<boolean>();
    loading: boolean = true;

    ngOnInit() { }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    reactiveForm: FormGroup = new FormGroup({
        oldPassword: new FormControl("", [Validators.required]),
        newPassword: new FormControl("", [Validators.required, validators.validatePassword]),
        confirmPassword: new FormControl("", [Validators.required, validators.validatePassword]),
    })

    submit(){
        if(this.reactiveForm.valid){
            this.authService.changePassword({
                email: this.email,
                t: this.token,
                newPass: this.reactiveForm.get('newPassword')?.value,
                oldPass: this.reactiveForm.get('oldPassword')?.value,
                confirmNewPass: this.reactiveForm.get('confirmPassword')?.value,
            }).subscribe(res => {
                this.toastService.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại với mật khẩu mới.");
                timer(3000).subscribe(() => {
                    this.router.navigateByUrl('/auth/login')
                })
            }, err => {
                console.log(err);
            })
        }
    }

    goBack(){
        if(history.length){
            history.back();
        }
        else {
            if(localStorage.get("user") && localStorage.get("user").token){
                let level = localStorage.get("user").level;
                if(level == CONSTS.auth.USER){
                    this.router.navigateByUrl('/money-lover')
                }
                else {
                    this.router.navigateByUrl('/money-lover/admin')
                }
            }
            else {
                this.router.navigateByUrl('/auth/login')
            };
        }
    }
}