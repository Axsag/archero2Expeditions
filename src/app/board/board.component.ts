import { Component } from '@angular/core';
import { BottomNavbarComponent } from '../bottom-navbar/bottom-navbar.component';
import { CommonModule } from '@angular/common';

type Token = 'red' | 'blue' | null;

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, BottomNavbarComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  board: { token: Token }[][] = [];
  selected: { row: number, col: number } | null = null;

  movingToken: {
    token: 'red' | 'blue';
    fromCell: string;
    toCell: string;
    progress: number;
  } | null = null;

  movingLeft = 0;
  movingTop = 0;

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

  isCellOccupied(row: number, col: number): boolean {
    return !!this.board?.[row]?.[col]?.token;
  }

  onCellTap(row: number, col: number) {
    const cell = this.board[row][col];

    // Si la cellule contient un pion
    if (cell.token) {
      const possibleMove = this.getSingleVerticalMove(row, col);
      if (!possibleMove) return;

      const token = cell.token;
      const fromClass = `cell-${row}-${col}`;
      const toClass = `cell-${possibleMove.row}-${possibleMove.col}`;

      this.board[row][col].token = null;

      this.movingToken = {
        token,
        fromCell: fromClass,
        toCell: toClass,
        progress: 0
      };

      const fromPos = this.getCellCenter(fromClass);
      const toPos = this.getCellCenter(toClass);

      const duration = 250;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        this.movingToken!.progress = progress;

        this.movingLeft = fromPos.left + (toPos.left - fromPos.left) * progress;
        this.movingTop = fromPos.top + (toPos.top - fromPos.top) * progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.board[possibleMove.row][possibleMove.col].token = token;
          this.board[row][col].token = null;
          this.movingToken = null;
        }
      };

      requestAnimationFrame(animate);
    }
  }

  getSingleVerticalMove(row: number, col: number): { row: number, col: number } | null {
    const directions = [-1, 1]; // haut et bas
    for (const dir of directions) {
      const newRow = row + dir;
      if (
        newRow >= 0 &&
        newRow < this.board.length &&
        this.board[newRow][col].token === null
      ) {
        return { row: newRow, col };
      }
    }
    return null;
  }

  getCellCenter(cellClass: string): { top: number; left: number } {
    const el = document.querySelector(`.cell.${cellClass}`) as HTMLElement;
    if (!el) return { top: 0, left: 0 };
    const rect = el.getBoundingClientRect();
    const board = document.querySelector('.board')?.getBoundingClientRect();
    return {
      left: rect.left - (board?.left ?? 0),
      top: rect.top - (board?.top ?? 0)
    };
  }
}
