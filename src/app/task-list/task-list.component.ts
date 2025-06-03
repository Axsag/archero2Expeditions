import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Task {
  id: string;
  icon: string;
  description: string;
  rewardPerStep: number;
  rewardCount: number;
  type: 'stepped' | 'infinite';
  totalSteps?: number;
  currentStep?: number;
  currentCount?: number;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  tasks: Task[] = [
    {
      id: 'clear-cave',
      icon: 'assets/icon_cave.png',
      description: 'Clear the Cave',
      rewardPerStep: 60,
      rewardCount: 2,
      type: 'stepped',
      totalSteps: 2,
      currentStep: 0
    },
    {
      id: 'monster-invasion',
      icon: 'assets/icon_chapter.png',
      description: 'Monster Invasion',
      rewardPerStep: 40,
      rewardCount: 1,
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
    this.saveProgress();
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
}
