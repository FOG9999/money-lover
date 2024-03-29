import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { ProfileOverviewComponent } from './overview/overview.component';
import { ProfileSettingsComponent } from './settings/settings.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const COMPONENTS = [ProfileLayoutComponent, ProfileOverviewComponent, ProfileSettingsComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, ProfileRoutingModule, MatSlideToggleModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class ProfileModule {}
