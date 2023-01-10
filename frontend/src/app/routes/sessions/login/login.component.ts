import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/authentication.service';
import { User } from 'app/model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  reactiveForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.reactiveForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  login() {
    let {username, password} = this.reactiveForm.value;
    this.authService.login(username, password).subscribe((res: User) => {
      console.log(res);
      if(res._id){
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/');
      }
    })
  }
}
