import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { validators } from '@shared/utils/validators';
import { User } from 'app/model/user.model';
import { UsersService } from 'app/routes/sysytem/users/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './settings.component.html',
  styles: [
    `
      mat-radio-button {
        margin-right: 15px;
      }
    `
  ]
})
export class ProfileSettingsComponent implements OnInit {
  reactiveForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UsersService, private toast: ToastrService) {

  }
  
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if(this.user.tfaMethod){
      this.hasTfa = true;
    }
    this.reactiveForm = this.fb.group({
      username: [this.user.username, [Validators.required, validators.validateUsername]],
      firstname: [this.user.firstname, [Validators.required, validators.validateName]],
      lastname: [this.user.lastname, [Validators.required, validators.validateName]],
      email: [this.user.email, [Validators.required, validators.validateEmail]],
      mobile: [this.user.mobile, [Validators.required, validators.validatePhoneNumber]],
      tfaMethod: [this.user.tfaMethod]
    });
  }

  user: Partial<User>;
  loading: boolean = false;
  hasTfa: boolean = false;

  updateUser(){
    if(this.reactiveForm.valid){
      if((this.hasTfa && this.reactiveForm.get('tfaMethod')?.value) || !this.hasTfa){
        this.loading = true;
        this.userService.updateUser({
          ...this.reactiveForm.value
        })
        .subscribe(res => {
          this.loading = false;
          this.toast.success("Cập nhật người dùng thành công");
          localStorage.setItem('user', JSON.stringify(res));
        }, () => {
          this.loading = false;
        })
      }
      else {
        this.toast.error("Chưa chọn phương thức xác thực 2 lớp");
      }
    }
  }

  onChangeHasTfa(value: boolean){
    if(!value){
      this.reactiveForm.get('tfaMethod')?.setValue(null);
    }
  }
}
