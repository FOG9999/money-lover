import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { StoreModule } from '@ngrx/store';
import { CoreReducer } from './store/core.reducer';
import { FEATURE_NAME } from './store/core.state';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(FEATURE_NAME, CoreReducer)],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
