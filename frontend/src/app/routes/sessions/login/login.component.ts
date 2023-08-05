import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/authentication.service';
import { environment } from '@env/environment';
import { LocalStorageService, getResponseErrorMessage } from '@shared';
import { CONSTS } from 'app/consts';
import { User } from 'app/model/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  reactiveForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private localStorage: LocalStorageService, private toastService: ToastrService) {
    this.reactiveForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() { }

  login() {
    let { username, password } = this.reactiveForm.value;
    this.authService.login(username, password).subscribe((res: User) => {
      if (res && res._id) {
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
    }, err => {
      this.toastService.error("Đăng nhập thất bại. Vui lòng thử lại");
    })
  }

  loginWith(appName: string) {
    switch (appName) {
      case 'github':
        window.location.href = `${environment.PassportLoginServerURL}/github?callbackUrl=${environment.MoneyLoverURL}/redirect&failbackUrl=${environment.MoneyLoverURL}/auth/login`;
        break;

      default:
        break;
    }
  }
}
