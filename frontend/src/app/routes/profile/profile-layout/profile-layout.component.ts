import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/authentication/authentication.service';
import { AuthDataService } from '@shared';
import { AppStorageService } from '@shared/services/app-storage.servce';
import { User } from 'app/model/user.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
})
export class ProfileLayoutComponent implements OnDestroy, OnInit {

  constructor(
    private storage: AppStorageService,
    private router: Router,
    private authDataService: AuthDataService,
    private authService: AuthService
  ){
    // NOTE: NO MORE USE security questions to authenticate user
    // this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
    //   if(params['k'] && params['endTime']){
    //     this.isRedirecting = true;
    //     this.authService.authKey(params['k'], Number(params['endTime']), window.location.pathname)
    //     .subscribe(res => {
    //       if(res.isValid){
    //         this.isRedirecting = false;
    //         this.showChangeQuestion = true;
    //       }
    //       else {
    //         this.router.navigateByUrl('/profile/settings')
    //       }
    //     }, err => {
    //       this.isRedirecting = false;
    //       this.router.navigateByUrl('/profile/settings')
    //     })
    //   }
    // })
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.complete();
  }

  showChangeQuestion: boolean = false;
  user: Partial<User>;
  isRedirecting: boolean = false;
  loadingChangepass: boolean = false;

  private destroy$ = new Subject();

  changeQuestion(){
    this.isRedirecting = true;
    this.authService.getKey('/profile/settings').subscribe(res => {
      this.authDataService.redirectFromAuthByQuestionChange$.next({...res});
      this.router.navigateByUrl('/auth/auth-question');
    })
  }

  saveCallback = () => {
    this.showChangeQuestion = false;
    this.router.navigateByUrl('/profile/settings');
  }

  goback = () => {
    this.showChangeQuestion = false;
  }

  changePassword(){
    this.loadingChangepass = true;
    this.authService.sendEmailChangePass(this.user.email).subscribe(res => {
      if(res && res.ok){
        this.storage.redirectFromProfile = true;
        this.router.navigateByUrl('/auth/sent-email-change-pass')
      }
    })
  }
}
