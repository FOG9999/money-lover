import { Component, Input, OnInit } from '@angular/core';
import { IconService } from '../../../services/money-lover/icon.service';

@Component({
    selector: 'ml-icon',
    templateUrl: 'icon.component.html',
    providers: [IconService]
})

export class MLIconComponent implements OnInit {
    constructor(private iconService: IconService) { }

    @Input()
    path: string;

    data: string = "";

    ngOnInit() { 
        this.iconService.getBase64Icon(this.path).subscribe(res => {
            this.data = res;
        })
    }
}