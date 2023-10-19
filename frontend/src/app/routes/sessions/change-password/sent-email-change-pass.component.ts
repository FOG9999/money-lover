import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStorageService } from '@shared/services/app-storage.servce';

@Component({
    selector: 'sent-email-change-pass',
    templateUrl: 'sent-email-change-pass.component.html',
    styleUrls: ['sent-email-change-pass.component.scss']
})

export class SentEmailChangePassComponent implements OnInit {
    constructor(private storage: AppStorageService, private router: Router) { 
        if(!this.storage.redirectFromProfile){
            this.router.navigateByUrl("/error/404");
        }
        else {
            this.show = true;
        }
    }

    show: boolean = false;
    ngOnInit() { }
}