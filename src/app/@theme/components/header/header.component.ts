import { Component, Input } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  @Input() position = 'normal';

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService) {
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

}
