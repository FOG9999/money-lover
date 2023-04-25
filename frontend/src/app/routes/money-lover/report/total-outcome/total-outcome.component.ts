import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';

@Component({
    selector: 'total-outcome',
    templateUrl: 'total-outcome.component.html',
    styleUrls: ["../report.component.scss"]
})

export class TotalOutcomeComponent implements OnInit {
    constructor(
        private service: ReportService
    ) { }

    totalOutcome: number = 123123123;

    ngOnInit() { }
}