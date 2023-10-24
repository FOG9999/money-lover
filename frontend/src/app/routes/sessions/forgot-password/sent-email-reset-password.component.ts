import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/authentication.service';
import { validators } from '@shared/utils/validators';

@Component({
    selector: 'sent-email-reset-password',
    templateUrl: 'sent-email-reset-password.component.html',
    styleUrls: ['sent-email-reset-password.component.scss']
})

export class SentEmailResetPasswordComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private authService: AuthService, 
        private router: Router
    ) { }

    ngOnInit() { 
        this.formGroupEmail = this.fb.group({
            email: ['', [Validators.required, validators.validateEmail]]
        })
    }

    formGroupEmail: FormGroup;
    loading: boolean = false;

    onSubmitEmail(){
        if(this.formGroupEmail.valid && this.formGroupEmail.get('email')?.value){
            this.loading = true;
            this.authService.sendReqResetPassword({email: this.formGroupEmail.get('email')?.value}).subscribe(res => {
                this.loading = false;
                this.router.navigateByUrl(`/auth/forgot-password?email=${res.email}&t=${res.t}`);
            }, () => {
                this.loading = false;
            })
        }
    }
}