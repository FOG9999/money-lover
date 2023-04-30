import { Component, OnInit } from '@angular/core';
import { ReportService } from './report.service';

@Component({
    selector: 'report',
    templateUrl: 'report.component.html'
})

export class ReportComponent implements OnInit {
    constructor(
        private service: ReportService
    ) { }

    average: {
        averageIncome: number,
        averageOutcome: number,
        sumIncome: number,
        sumOutcome: number,
    } = {
        averageIncome: 0,
        averageOutcome: 0,
        sumIncome: 0,
        sumOutcome: 0
    }
    overall: {
        income: number[],
        outcome: number[]
    } = {
        income: [],
        outcome: []
    }

    ngOnInit() { 
        this.service.getAveragePerMonth().subscribe(res => {
            this.average = res;
        })
        this.service.getOverallEveryMonth().subscribe(res => {
            this.overall = res;
        })
    }
}