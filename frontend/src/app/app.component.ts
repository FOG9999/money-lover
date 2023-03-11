import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreloaderService } from '@core';
import { CoreState, FEATURE_NAME } from '@core/store/core.state';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private preloader: PreloaderService, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(FEATURE_NAME).subscribe((state: CoreState) => {
      this.loading = state.loading;
    })
  }

  loading: boolean;

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
