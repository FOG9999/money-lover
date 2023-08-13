import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { validators } from '@shared/utils/validators';
import { User } from 'app/model/user.model';
import { UsersService } from 'app/routes/sysytem/users/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './settings.component.html',
})
export class ProfileSettingsComponent implements OnInit {
  reactiveForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UsersService, private toast: ToastrService) {

  }
  
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.reactiveForm = this.fb.group({
      username: [this.user.username, [Validators.required, validators.validateUsername]],
      firstname: [this.user.firstname, [Validators.required, validators.validateName]],
      lastname: [this.user.lastname, [Validators.required, validators.validateName]],
      email: [this.user.email, [Validators.required, validators.validateEmail]],
    });
  }

  user: Partial<User>;

  updateUser(){
    this.userService.updateUser({
      ...this.reactiveForm.value
    })
    .subscribe(res => {
      this.toast.success("Cập nhật người dùng thành công");
      localStorage.setItem('user', JSON.stringify(res));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })
  }
}
