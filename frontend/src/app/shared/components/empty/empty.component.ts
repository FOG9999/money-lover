import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'empty',
    templateUrl: 'empty.component.html',
    styleUrls: ['empty.component.scss']
})

export class EmptyComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

    @Input() emptyTxt: string = "Không có dữ liệu"
}