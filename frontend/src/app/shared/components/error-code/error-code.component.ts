import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { LocalStorageService } from '@shared/services/storage.service';
import { CONSTS } from 'app/consts';

@Component({
  selector: 'error-code',
  templateUrl: './error-code.component.html',
  styleUrls: ['./error-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ErrorCodeComponent implements OnInit {
  @Input() code = '';
  @Input() title = '';
  @Input() message = '';

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit() {
    if(this.localStorage.get("user") && this.localStorage.get("user").token){
      let level = this.localStorage.get("user").level;
      if(level == CONSTS.auth.ADMIN || level == CONSTS.auth.SYSTEM){
        this.homeUrl = "/money-lover/admin"
      }
    }
  }

  homeUrl: string = "/money-lover";
}
