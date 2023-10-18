import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/authentication.service';
import { LocalStorageService } from '@shared';
import { validators } from '@shared/utils/validators';
import { CONSTS } from 'app/consts';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'two-factor-authen',
    templateUrl: 'two-factor-authen.component.html',
    styleUrls: ['two-factor-authen.component.scss']
})

export class TwoFactorAuthenComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private router: Router, 
        private authService: AuthService, 
        private localStorage: LocalStorageService, 
        private toastService: ToastrService
    ) { }

    ngOnInit() { 
        this.formGroupEmail = this.fb.group({
            email: ['', [Validators.required, validators.validateEmail]]
        })
    }

    formGroup: FormGroup = new FormGroup({
        verifyCode: new FormControl("", [Validators.required])
    })
    formGroupEmail: FormGroup;
    hashedSecret: string = "";
    loading: boolean = false;
    @Input() receivedEmail: string = "";
    @Input() rd: string = "";
    @Output() onEmailFail = new EventEmitter();
    @Output() onEmailSuccess = new EventEmitter();
    @Output() onVerifyFail = new EventEmitter();
    @Output() onVerifySuccess = new EventEmitter();

    onSubmitEmail(){
        if(this.formGroupEmail.get('email')?.value != this.receivedEmail){
            this.toastService.error("Email không trùng khớp với thông tin đăng ký trên hệ thống. Vui lòng thử lại");
            return;
        }
        if(this.formGroupEmail.valid && this.formGroupEmail.get('email')?.value){
            this.loading = true;
            this.authService.generateOTP(this.formGroupEmail.get('email')?.value, this.rd).subscribe(res => {
                this.loading = false;
                if(res.redirect){
                    this.hashedSecret = res.redirect;
                    if(this.onEmailSuccess){
                        this.onEmailSuccess.next(true);
                    }
                }
                else {
                    this.toastService.error("Response không hợp lệ");
                    if(this.onEmailFail){
                        this.onEmailFail.next(true);
                    }
                }
            }, () => {
                this.loading = false;
                if(this.onEmailFail){
                    this.onEmailFail.next(true);
                }
            })
        }
    }

    onVerify(){
        if(this.formGroup.valid && this.formGroup.get('verifyCode')?.value){            
            this.loading = true;
            this.authService.verifyOTP(this.hashedSecret, this.formGroup.get('verifyCode')?.value).subscribe(res => {
                this.loading = false;
                if (res && res._id) {
                    if(this.onVerifySuccess){
                        this.onVerifySuccess.next(true);
                    }
                    this.localStorage.set('user', res);
                    if (res.level === CONSTS.auth.ADMIN || res.level === CONSTS.auth.SYSTEM) {
                      this.router.navigateByUrl('/money-lover/admin');
                    }
                    else {
                      this.router.navigateByUrl('/money-lover/');
                    }
                  }
                  else {
                    this.toastService.error("Đăng nhập thất bại. Vui lòng thử lại");
                  }
            }, () => {
                this.loading = false;
                if(this.onVerifyFail){
                    this.onVerifyFail.next(true);
                }
            })
        }
        }
}