import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BottomNavbarComponent} from '../bottom-navbar/bottom-navbar.component';

export interface Task {
  id: string;
  icon: string;
  description: string;
  rewardPerStep: number;
  type: 'stepped' | 'infinite';
  totalSteps?: number;
  currentStep?: number;
  currentCount?: number;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    BottomNavbarComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {

  tasks: Task[] = [
    {
      id: 'guild-mi',
      icon: 'assets/icon_cave.png',
      description: 'Guild Monster Invasion',
      rewardPerStep: 60,
      type: 'stepped',
      totalSteps: 2,
      currentStep: 0
    },
    {
      id: 'seal-battle',
      icon: 'assets/icon_cave.png',
      description: 'Seal Battle (quick raid possible)',
      rewardPerStep: 60,
      type: 'stepped',
      totalSteps: 3,
      currentStep: 0
    },
    {
      id: 'gold-cave',
      icon: 'assets/icon_cave.png',
      description: 'Gold Cave (quick raid possible)',
      rewardPerStep: 30,
      type: 'stepped',
      totalSteps: 2,
      currentStep: 0
    },
    {
      id: 'shackled-jg',
      icon: 'assets/icon_cave.png',
      description: 'Shackled Jungle (quick raid possible)',
      rewardPerStep: 60,
      type: 'infinite',
      currentCount: 0
    },
    {
      id: 'abyssal-tide',
      icon: 'assets/icon_cave.png',
      description: 'Abyssal Tide (quick raid possible)',
      rewardPerStep: 60,
      type: 'infinite',
      currentCount: 0
    },
    {
      id: 'sky-tower',
      icon: 'assets/icon_cave.png',
      description: 'Sky Tower (full Clear)',
      rewardPerStep: 25,
      type: 'infinite',
      currentCount: 0
    },
    {
      id: 'clear-chapters',
      icon: 'assets/icon_chapter.png',
      description: 'Clear chapters (6min)',
      rewardPerStep: 40,
      type: 'infinite',
      currentCount: 0
    }
  ];

  constructor() {
    const saved = localStorage.getItem('taskProgress');
    if (saved) {
      this.tasks = JSON.parse(saved);
    }
  }

  changeStep(task: Task, delta: number) {
    if (task.type === 'stepped') {
      task.currentStep = Math.max(0, Math.min(task.totalSteps!, (task.currentStep || 0) + delta));
    } else if (task.type === 'infinite') {
      task.currentCount = Math.max(0, (task.currentCount || 0) + delta);
    }
    this.saveProgress();
  }

  resetAll() {
    this.tasks.forEach(task => {
      if (task.type === 'stepped') {
        task.currentStep = 0;
      } else if (task.type === 'infinite') {
        task.currentCount = 0;
      }
    });
    localStorage.removeItem('taskProgress');
  }

  getReward(task: Task): number {
    if (task.type === 'stepped') {
      return (task.currentStep || 0) * task.rewardPerStep;
    } else {
      return (task.currentCount || 0) * task.rewardPerStep;
    }
  }

  getProgress(task: Task): number {
    if (task.type === 'stepped') {
      return ((task.currentStep || 0) / (task.totalSteps || 1)) * 100;
    } else {
      return 100;
    }
  }

  saveProgress() {
    localStorage.setItem('taskProgress', JSON.stringify(this.tasks));
  }

  getStepText(task: Task): string {
    if (task.type === 'stepped') {
      return `(${task.currentStep}/${task.totalSteps})`;
    } else {
      return `(${task.currentCount}/∞)`;
    }
  }

  getTotalReward(): number {
    return this.tasks.reduce((total, task) => total + this.getReward(task), 0);
  }
  getStepReward(task: Task): number {
    if (task.type === 'stepped') {
      return Math.floor(task.rewardPerStep / task.totalSteps!);
    } else {
      return task.rewardPerStep;
    }
  }
}
