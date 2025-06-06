import { Routes } from '@angular/router';
import {SkillListComponent} from './skill-list/skill-list.component';
import {TaskListComponent} from './task-list/task-list.component';
import {BoardComponent} from './board/board.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'talents', component: SkillListComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'board', component: BoardComponent }
];
