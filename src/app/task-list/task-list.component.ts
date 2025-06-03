import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BottomNavbarComponent} from '../bottom-navbar/bottom-navbar.component';

export interface Task {
  id: string;
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

  localStorageItem = 'tasksitem46846';

  privileges = {
    cave: false,
    seal: false,
    abyssal: false
  };

  tasks: Task[] = [
    {
      id: 'guild-mi',
      description: 'Guild Monster Invasion',
      rewardPerStep: 60,
      type: 'stepped',
      totalSteps: 2,
      currentStep: 0
    },
    {
      id: 'seal-battle',
      description: 'Seal Battle (quick raid possible)',
      rewardPerStep: 60,
      type: 'stepped',
      totalSteps: 3,
      currentStep: 0
    },
    {
      id: 'gold-cave',
      description: 'Gold Cave (quick raid possible)',
      rewardPerStep: 30,
      type: 'stepped',
      totalSteps: 2,
      currentStep: 0
    },
    {
      id: 'shackled-jg',
      description: 'Shackled Jungle (quick raid possible)',
      rewardPerStep: 60,
      type: 'stepped',
      totalSteps: 2,
      currentStep: 0
    },
    {
      id: 'abyssal-tide',
      description: 'Abyssal Tide (quick raid possible)',
      rewardPerStep: 60,
      type: 'stepped',
      totalSteps: 2,
      currentStep: 0
    },
    {
      id: 'sky-tower',
      description: 'Sky Tower (full Clear)',
      rewardPerStep: 25,
      type: 'infinite',
      currentCount: 0
    },
    {
      id: 'clear-chapters',
      description: 'Clear chapters (6min)',
      rewardPerStep: 50,
      type: 'infinite',
      currentCount: 0
    }
  ];

  constructor() {
    const saved = localStorage.getItem(this.localStorageItem);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.tasks = parsed.tasks || this.tasks;
      this.privileges = parsed.privileges || this.privileges;
      this.applyPrivileges();
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

    const currentPrivileges = this.privileges;

    this.tasks.forEach(task => {
      if (task.type === 'stepped') {
        task.currentStep = 0;
      } else if (task.type === 'infinite') {
        task.currentCount = 0;
      }
    });

    localStorage.removeItem(this.localStorageItem);

    this.saveProgress();

    this.privileges = currentPrivileges;
  }

  applyPrivileges() {
    // Reset to base task config first
    this.tasks.forEach(task => {
      switch (task.id) {
        case 'gold-cave':
          task.totalSteps = 2 + (this.privileges.cave ? 2 : 0);
          task.currentStep = Math.min(task.currentStep ?? 0, task.totalSteps);
          break;
        case 'seal-battle':
          task.totalSteps = 3 + (this.privileges.seal ? 1 : 0);
          task.currentStep = Math.min(task.currentStep ?? 0, task.totalSteps);
          break;
        case 'shackled-jg':
          task.totalSteps = 3 + (this.privileges.abyssal ? 2 : 0);
          task.currentStep = Math.min(task.currentStep ?? 0, task.totalSteps);
          break;
        case 'abyssal-tide':
          task.totalSteps = 3 + (this.privileges.abyssal ? 1 : 0);
          task.currentStep = Math.min(task.currentStep ?? 0, task.totalSteps);
          break;
        case 'sky-tower':
          // task.totalSteps = 6 + (this.privileges.abyssal ? 3 : 0);
          // task.currentStep = Math.min(task.currentStep ?? 0, task.totalSteps);
          break;
      }
    });

    if (this.privileges.abyssal) {
      const addCount = (id: string, add: number) => {
        const t = this.tasks.find(t => t.id === id);
        if (t?.type === 'infinite') {
          t.rewardPerStep = t.rewardPerStep; // unchanged, kept for clarity
          // could apply any logic here if count should change
        }
      };
      addCount('shackled-jg', 2);
      addCount('abyssal-tide', 1);
      addCount('sky-tower', 3);
    }
  }

  togglePrivilege(priv: keyof typeof this.privileges) {
    this.privileges[priv] = !this.privileges[priv];
    this.applyPrivileges();
    this.saveProgress();
  }

  saveProgress() {
    localStorage.setItem(this.localStorageItem, JSON.stringify({
      tasks: this.tasks,
      privileges: this.privileges
    }));
  }
}
