import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SkillListComponent} from './skill-list/skill-list.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SkillListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'archero2Expedition';
}
