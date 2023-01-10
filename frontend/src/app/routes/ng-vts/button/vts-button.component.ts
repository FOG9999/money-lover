import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vts-button',
  templateUrl: 'vts-button.component.html',
})
export class VTSButtonComponent implements OnInit {
  counter = 0;

  constructor(public snackBar: MatSnackBar) {}

  ngOnInit() {}

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }

  increase() {
    this.counter++;
    this.openSnackBar(`Click counter is set to ${this.counter}`);
  }
}
