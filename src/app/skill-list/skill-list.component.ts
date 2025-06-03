import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { skills } from './skills';
import { Skill } from './skill.model';
import {BottomNavbarComponent} from '../bottom-navbar/bottom-navbar.component';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [
    CommonModule,
    BottomNavbarComponent
  ],
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent {
  readonly maxScore = 50000;
  skills: Skill[] = skills;
}

/**
 *
 * Seal 60x4=240
 * Gold Cave 30x4=120
 * Shackled/Abyss(maybe) 60x4=240
 * Monster Invasion 60x2=120
 * Total=720/day
 * 5040/week
 *
 */
