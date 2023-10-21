import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IconService } from '../../../services/money-lover/icon.service';
import { NgStyleType } from '@angular/flex-layout/extended/style/style-transforms';

@Component({
    selector: 'ml-icon',
    templateUrl: 'icon.component.html',
    providers: [IconService]
})

export class MLIconComponent implements OnInit, OnChanges {
    constructor(private iconService: IconService) { }

    @Input()
    path: string;
    @Input() loadingConfig: {[k: string]: any} = {
        width: '150px',
        height: '150px'
    }

    data: string = "";
    loading: boolean = false;

    ngOnInit() {
        this.getIcon(this.path);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.getIcon(changes.path.currentValue);
    }

    getIcon(path: string) {
        this.loading = true;
        if(!path){
            return;
        }
        if(sessionStorage.getItem(path)){
            this.data = sessionStorage.getItem(path);
            this.loading = false;
        }
        else this.iconService.getBase64Icon(path).subscribe(res => {
            this.data = res;
            this.loading = false;
            sessionStorage.setItem(path, res);
        });
    }
}