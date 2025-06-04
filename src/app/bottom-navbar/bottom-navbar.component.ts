import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'bottom-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss']
})
export class BottomNavbarComponent {
  constructor(private router: Router) {}

  navItems = [
    { key: 'builds', icon: 'assets/MainPage_2.png', label: 'Builds', path: 'https://axsag.github.io/archero2Builds/', external: true, align: 'left' },
    { key: 'treasure', icon: 'assets/Icon_Monopoly.png', label: 'Treasure\nIsland', path: 'https://ksun4176.github.io/archero2-island-treasure-hunt/', external: true, align: 'left' },
    { key: 'kofi', icon: 'assets/tip-kofi-alt.gif', label: 'Ko-fi', path: 'https://ko-fi.com/W7W41B9W0J', external: true, align: 'left' },
    { key: 'tasks', icon: 'assets/Icon_TaskCenter.png', label: 'Tasks', path: '/tasks', external: false, align: 'right' },
    { key: 'talents', icon: 'assets/icon_tianfushu.png', label: 'Talents', path: '/talents', external: false, align: 'right' },
  ];

  get leftNavItems() {
    return this.navItems.filter(i => i.align === 'left');
  }

  get rightNavItems() {
    return this.navItems.filter(i => i.align !== 'left');
  }

  @Input() selectedKey = '';

  isActive(path: string): boolean {
    if (this.router.url === '/' && path === '/tasks')
      return true;
    return this.router.url === path;
  }
  formatLabel(label: string): string {
    return label.replace(/\n/g, '<br>');
  }
}
