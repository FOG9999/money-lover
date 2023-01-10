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

    ngOnInit() { 
        this.commonService.getListData("icon", {
            path: "0d9f5d76-cd9c-4797-bd4e-b8372e2eda24.png"
        })
        .subscribe((res: Icon[]) => {
            let listIcons: Icon[] = res;
            console.log(listIcons);
        })
    }
}