import { Pipe, PipeTransform } from '@angular/core';
import { CONSTS } from 'app/consts';

@Pipe({
    name: 'levelRole'
})

export class LevelRolePipe implements PipeTransform {
    transform(value: keyof typeof CONSTS.auth, ...args: any[]): any {
        switch (value) {
            case 'ADMIN':
                return 'Quản trị hệ thống';
            case 'SYSTEM': 
                return 'Quản trị hệ thống';
            case 'USER': {
                return 'Người dùng'
            }
            default:
                return '';
        }
    }
}