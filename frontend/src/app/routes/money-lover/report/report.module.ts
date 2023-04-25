import { NgModule } from '@angular/core';
import { ReportService } from './report.service';
import { TotalOutcomeComponent } from './total-outcome/total-outcome.component';
import { TotalIncomeComponent } from './total-income/total-income.component';
import { AverageIncomeComponent } from './average-income/average-income.component';
import { AverageOutcomeComponent } from './average-outcome/average-outcome.component';
import { OverallInOutcomeComponent } from './overall-in-outcome/overall-in-outcome.component';
import { ReportComponent } from './report.component';
import { SharedModule } from '@shared';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
    imports: [
        SharedModule, NgApexchartsModule, ReportRoutingModule
    ],
    declarations: [
        TotalOutcomeComponent,
        TotalIncomeComponent,
        AverageIncomeComponent,
        AverageOutcomeComponent,
        OverallInOutcomeComponent,
        ReportComponent
    ],
    providers: [
        ReportService
    ],
})
export class ReportModule { }
