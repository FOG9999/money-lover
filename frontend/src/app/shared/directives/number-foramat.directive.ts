import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { ControlContainer, FormControl, NgControl } from '@angular/forms';

@Directive({
  selector: 'input[numberFormat]'
})
export class NumberFormatDirective implements OnInit {
  private el: HTMLInputElement;

  constructor(elementRef: ElementRef, private formControl: NgControl) {
    this.el = elementRef.nativeElement;
  }

  ngOnInit() {
    this.formControl.control.setValue(this.formatNumber(this.formControl.control.value));
  }

  @HostListener('keyup', ['$event.target.value'])
  onKeyUp(value: string) {
    this.formControl.control.setValue(this.formatNumber(value));
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Ctrl+A
      (e.keyCode == 65 && (e.ctrlKey || e.metaKey)) ||
      // Ctrl+C
      (e.keyCode == 67 && (e.ctrlKey || e.metaKey)) ||
      // Ctrl+V
      (e.keyCode == 86 && (e.ctrlKey || e.metaKey)) ||
      // Ctrl+X
      (e.keyCode == 88 && (e.ctrlKey || e.metaKey)) ||
      // Home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // only allow numbers
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }

  private formatNumber(s:string):string {
    let n = parseInt(s.toString().replace(/\D/g, '')); // in case s is not a string
    return isNaN(n) ? '' : n.toLocaleString('vi-VN');
  }
}