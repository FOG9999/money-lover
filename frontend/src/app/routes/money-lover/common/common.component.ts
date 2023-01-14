import { Component, OnInit } from '@angular/core';
import { Icon } from 'app/model/icon.model';
import { CommonService } from './common.service';

@Component({
    selector: 'common',
    templateUrl: 'common.component.html',
    providers: [CommonService]
})

export class MoneyCommonComponent implements OnInit {
    constructor(private commonService: CommonService) { }

    icons: Icon[] = [];

    ngOnInit() { 
        this.commonService.getListData("icon", {})
        .subscribe((res: Icon[]) => {
            this.icons = [...res];            
        })
    }
}