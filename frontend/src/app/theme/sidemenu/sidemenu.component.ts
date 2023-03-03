import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from '@core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
})
export class SidemenuComponent implements OnInit {
  // NOTE: Ripple effect make page flashing on mobile
  @Input() ripple = false;

  menus = this.menuService.getAll();

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.menu.subscribe(change => {
      console.log(change, this.menuService.getAll());
    })
  }

  // Delete empty values and rebuild route
  buildRoute(routes: string[]) {
    let route = '';
    routes.forEach(item => {
      if (item && item.trim()) {
        route += '/' + item.replace(/^\/+|\/+$/g, '');
      }
    });
    return route;
  }
}
