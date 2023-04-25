import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';

@Component({
    selector: 'average-outcome',
    templateUrl: 'average-outcome.component.html',
    styleUrls: ["../report.component.scss"]
})

export class AverageOutcomeComponent implements OnInit {
    constructor(
        private service: ReportService
    ) { }

    averageOutcome: number = 12412;

    ngOnInit() { }
}