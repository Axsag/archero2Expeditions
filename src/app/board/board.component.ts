import { Component } from '@angular/core';
import {BottomNavbarComponent} from '../bottom-navbar/bottom-navbar.component';
import {CommonModule} from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

type Token = 'red' | 'blue' | null;

@Component({
  selector: 'app-board',
  imports: [
    CommonModule,
    BottomNavbarComponent
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  board: { token: Token }[][] = [];

  dragged = { row: -1, col: -1 };

  constructor() {
    this.resetBoard();
  }

  resetBoard() {
    this.board = Array.from({ length: 3 }, (_, row) =>
      Array.from({ length: 3 }, (_, col) => ({
        token:
          row === 0 ? 'red' :
            row === 2 ? 'blue' :
              null
      }))
    );
  }

  onDragStart(row: number, col: number) {
    this.dragged = { row, col };
  }

  onDrop(row: number, col: number) {
    const from = this.dragged;
    const movingToken = this.board[from.row][from.col].token;

    if (!movingToken) return;

    // Only allow vertical movement on the same column
    if (col !== from.col) return;

    // No overlap
    if (this.board[row][col].token !== null) return;

    // No jump over
    const range = from.row < row
      ? [from.row + 1, row]
      : [row + 1, from.row];

    for (let r = range[0]; r < range[1]; r++) {
      if (this.board[r][col].token !== null) return;
    }

    // Move token
    this.board[row][col].token = movingToken;
    this.board[from.row][from.col].token = null;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }
}
