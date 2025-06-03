import { Routes } from '@angular/router';
import {SkillListComponent} from './skill-list/skill-list.component';
import {TaskListComponent} from './task-list/task-list.component';

export const routes: Routes = [
  { path: '', component: SkillListComponent },
  { path: 'tasks', component: TaskListComponent }
];
