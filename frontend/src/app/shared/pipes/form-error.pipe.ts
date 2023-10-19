import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'formError'
})

export class FormErrorPipe implements PipeTransform {

    constructor(private translate: TranslateService){}

    transform(control: AbstractControl, ...args: any[]): string {
        if(control.invalid){
            return Object.keys(control.errors).map(e => this.translate.instant(`formError.${e}`)).join(' ');
        }
        return '';
    }
}