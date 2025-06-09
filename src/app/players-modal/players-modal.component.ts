import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Player {
  name: string;
  power: number;
  lane: 0 | 1 | 2 | 3;
}

@Component({
  selector: 'app-players-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './players-modal.component.html',
  styleUrls: ['./players-modal.component.scss']
})
export class PlayersModalComponent implements OnInit {
  showModal = false;
  players: Player[] = [];

  selectedFilterLane: 0 | 1 | 2 | 3 | null = null;

  readonly allLanes: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];
  readonly lanes: (1 | 2 | 3)[] = [1, 2, 3];

  newPlayerName = '';
  newPlayerPower: number | null = null;
  showAddPlayerForm = false;

  ngOnInit() {
    this.loadPlayers();

    if (this.players.length === 0) {
      // Only add demo players if none are stored
      this.addPlayer('Example Left', 1.2, 1);
      this.addPlayer('Example Mid', 1.2, 2);
      this.addPlayer('Example Right', 1.2, 3);
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  loadPlayers() {
    const data = localStorage.getItem('players');
    this.players = data ? JSON.parse(data) : [];
  }

  savePlayers() {
    localStorage.setItem('players', JSON.stringify(this.players));
  }

  assignLane(player: Player, lane: 1 | 2 | 3) {
    player.lane = player.lane === lane ? 0 : lane;
    this.savePlayers();
  }

  addPlayer(name: string, power: number, lane: 0 | 1 | 2 | 3 = 0 ) {
    this.players.push({ name, power, lane });
    this.savePlayers();
  }

  addPlayerFromPrompt() {
    const name = prompt('Enter player name:');
    if (!name || name.trim() === '') return;

    const powerStr = prompt('Enter player power:');
    const power = parseFloat(powerStr ?? '');
    if (isNaN(power)) return;

    this.addPlayer(name.trim(), power);
  }

  deletePlayer(playerToDelete: Player) {
    this.players = this.players.filter(player => player !== playerToDelete);
    this.savePlayers();
  }

  get filteredPlayers(): Player[] {
    const players = this.selectedFilterLane === null
      ? this.players
      : this.players.filter(player => player.lane === this.selectedFilterLane);

    return players.slice().sort((a, b) => b.power - a.power);
  }

  selectFilterLane(lane: 0 | 1 | 2 | 3) {
    this.selectedFilterLane = this.selectedFilterLane === lane ? null : lane;
  }

  toggleAddPlayerForm() {
    this.showAddPlayerForm = !this.showAddPlayerForm;
    this.newPlayerName = '';
    this.newPlayerPower = null;
  }

  confirmAddPlayer() {
    const name = this.newPlayerName.trim();
    const power = this.newPlayerPower;

    if (!name || power === null || isNaN(power)) return;

    this.addPlayer(name, power);
    this.toggleAddPlayerForm();
  }
}
