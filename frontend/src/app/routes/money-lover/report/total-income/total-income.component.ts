import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from '../report.service';

@Component({
    selector: 'total-income',
    templateUrl: 'total-income.component.html',
    styleUrls: ["../report.component.scss"]
})

export class TotalIncomeComponent implements OnInit {
    constructor(
    ) { }

    @Input() totalIncome: number = 0;

    ngOnInit() { }
}