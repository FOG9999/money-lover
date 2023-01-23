import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IconService } from '../../../services/money-lover/icon.service';

@Component({
    selector: 'ml-icon',
    templateUrl: 'icon.component.html',
    providers: [IconService]
})

export class MLIconComponent implements OnInit, OnChanges {
    constructor(private iconService: IconService) { }

    @Input()
    path: string;

    data: string = "";

    ngOnInit() {
        this.getIcon(this.path);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.getIcon(changes.path.currentValue);
    }

    getIcon(path: string) {
        if(sessionStorage.getItem(path)){
            this.data = sessionStorage.getItem(path);
        }
        else this.iconService.getBase64Icon(path).subscribe(res => {
            this.data = res;
            sessionStorage.setItem(path, res);
        });
    }
}