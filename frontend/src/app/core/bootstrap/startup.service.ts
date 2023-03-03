import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Menu, MenuChildrenItem, MenuService } from './menu.service';
import { CONSTS } from 'app/consts';
import { LocalStorageService } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  constructor(private menuService: MenuService, private http: HttpClient, private localStorage: LocalStorageService) { }

  load(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .get('assets/data/menu.json?_t=' + Date.now())
        .pipe(
          catchError(res => {
            resolve();
            return res;
          })
        )
        .subscribe(
          (res: any) => {
            let menu = this.getMenu(res.menu);
            this.menuService.recursMenuForTranslation(menu, 'menu'); // the input 'menu' is modified after this function for a correct input for .set()
            this.menuService.set(menu);
          },
          () => { },
          () => {
            resolve();
          }
        );
    });
  }

  getMenu(menu: Menu[]) {
    let showMenus: Menu[] = [];
    let level: string = this.localStorage.get("user").level;
    menu.forEach(m => {
      if (m.level) {
        if (m.level.includes(CONSTS.auth.NONE)) {
          showMenus.push(m);
        }
        else {
          if (m.level.includes(level)) {
            if (m.children && m.children.length > 0) {
              showMenus.push({
                ...m,
                children: [
                  ...this.getMenuChildren(m)
                ]
              });
            }
            else {
              showMenus.push({
                ...m
              })
            }
          }
        }
      }
    })
    return showMenus;
  }

  getMenuChildren(menu: Menu | MenuChildrenItem) {
    let children: MenuChildrenItem[] = [];
    let level: string = this.localStorage.get("user").level;
    menu.children.forEach(m => {
      if (m.level.includes(level)) {
        if (m.children && m.children.length > 0) {
          children.push({
            ...m,
            children: [
              ...this.getMenuChildren(m)
            ]
          });
        }
        else {
          children.push({
            ...m
          })
        }
      }
    });
    return children;
  }
}
