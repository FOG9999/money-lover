import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from '../report.service';

@Component({
    selector: 'average-income',
    templateUrl: 'average-income.component.html',
    styleUrls: ["../report.component.scss"]
})

export class AverageIncomeComponent implements OnInit {
    constructor(
    ) { }

    @Input() averageIncome: number = 0;

    ngOnInit() { }
}