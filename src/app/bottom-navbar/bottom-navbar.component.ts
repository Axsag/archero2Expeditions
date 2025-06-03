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
    { key: 'tasks', icon: 'assets/Icon_TaskCenter.png', label: 'Tasks', path: '/tasks' },
    { key: 'talents', icon: 'assets/icon_tianfushu.png', label: 'Talents', path: '/talents' },
  ];

  @Input() selectedKey = '';

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
