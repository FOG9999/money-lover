import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/authentication.service';
import { validators } from '@shared/utils/validators';
import { CONSTS } from 'app/consts';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
    `
      :host {
        height: 100%;
        display: block;
        > div {
            min-height: 100vh;
        }
      }
    `
  ]
})
export class RegisterComponent implements OnInit {
  reactiveForm: FormGroup;
  errors = CONSTS.messages.register;
  isSubmitted: boolean = false;
  showQuestion: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authenService: AuthService, private toast: ToastrService) {
    this.reactiveForm = this.fb.group({
      username: ['', [Validators.required, validators.validateUsername]],
      password: ['', [Validators.required, validators.validatePassword]],
      firstname: ['', [Validators.required, validators.validateName]],
      lastname: ['', [Validators.required, validators.validateName]],
      email: ['', [Validators.required, validators.validateEmail]],
      confirmPassword: ['', [this.confirmValidator]],
    });
  }

  ngOnInit() {}

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.reactiveForm.controls.password.value) {
      return { error: true, confirm: true };
    }
    return {};
  };

  backToRegister = () => {
    this.showQuestion = false;
  }

  setupSecurityQuestion(){
    this.showQuestion = true;
  }

  register = (questions: string[], answers: string[]) => {
    this.isSubmitted = true;
    this.authenService.createUser({
      ...this.reactiveForm.value,
      questions,
      answers,
      level: 'USER'
    }).subscribe((res: any) => {
      if(res.code){
        this.toast.error(res.message);
        this.isSubmitted = false;
        this.showQuestion = false;
      }
      else {
        this.toast.success(CONSTS.messages.create_account_success);
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login')
        }, 2000);                
      }
    }) 
  }
}
