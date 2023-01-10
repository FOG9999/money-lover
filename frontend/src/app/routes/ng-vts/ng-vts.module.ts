import { NgModule } from '@angular/core';
import {VtsButtonModule} from '@ui-vts/ng-vts/button'
import {VtsIconModule} from '@ui-vts/ng-vts/icon'
import { VTSButtonComponent } from './button/vts-button.component';
import { NgVTSRoutingModule } from './ng-vts-routing.module';
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'
import { SharedModule } from '@shared';

@NgModule({
    imports: [NgVTSRoutingModule, VtsButtonModule, MatIconModule, VtsIconModule, MatCardModule, SharedModule],
    declarations: [VTSButtonComponent],
})
export class NgVTSModule { }
