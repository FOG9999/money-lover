import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthDataService } from '@shared';
import { User } from 'app/model/user.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
})
export class ProfileLayoutComponent implements OnDestroy, OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authDataService: AuthDataService,
  ){
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if(params['showQuestion'] == '1'){
        this.showChangeQuestion = true;
      }
    })
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
  private destroy$ = new Subject();

  changeQuestion(){
    this.authDataService.redirectFromAuthByQuestionChange$.next('/profile/overview?showQuestion=1')
    this.router.navigateByUrl('/auth/auth-question');
  }

  saveCallback = () => {
    this.showChangeQuestion = false;
  }

  goback = () => {
    this.showChangeQuestion = false;
  }
}
