import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Player {
  name: string;
  power: number;
  lane: 0 | 1 | 2 | 3;
  gearset: 1 | 2 | 3;
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
  readonly laneNames: Record<1 | 2 | 3, string> = {
    1: 'Left',
    2: 'Mid',
    3: 'Right'
  };

  newPlayerName = '';
  newPlayerPower: number | null = null;
  newPlayerGearset:  1 | 2 | 3 = 1;
  showAddPlayerForm = false;

  ngOnInit() {
    this.loadPlayers();

    if (this.players.length === 0) {
      this.generateRandomPlayers(3);
    }
  }

  openModal(laneFilter: 0|1|2|3|null = null) {
    if (laneFilter !== null) {
      this.selectFilterLane(laneFilter);
    }
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

  addPlayer(name: string, power: number, lane: 0 | 1 | 2 | 3 = 0, gearset: 1 | 2 | 3 = 1 ) {
    this.players.push({ name, power, lane, gearset });
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
    const gearset = this.newPlayerGearset;

    if (!name || power === null || isNaN(power)) return;

    this.addPlayer(name, power, 0, gearset);
    this.toggleAddPlayerForm();
  }

  getLanePlayerCount(lane: 1 | 2 | 3): string {
    const players = this.players.filter(p => p.lane === lane);
    const count = players.length;
    return count <= 8 ? `${count}/8` : `8/8 (+${count - 8})`;
  }

  getLaneTotalPower(lane: 1 | 2 | 3): string {
    const players = this.players
      .filter(p => p.lane === lane)
      .sort((a, b) => b.power - a.power)
      .slice(0, 8); // top 8 only
    const total = players.reduce((sum, p) => sum + p.power, 0);
    return total.toFixed(1);
  }

  isTop8(player: Player): boolean {
    const lanePlayers = this.players
      .filter(p => p.lane === player.lane && player.lane !== 0)
      .sort((a, b) => b.power - a.power)
      .slice(0, 8);
    return lanePlayers.includes(player);
  }

  distributePlayersEvenly(lanesCount: 2 | 3 = 3) {
    // Sort players descending by power
    const sorted = this.players.slice().sort((a, b) => b.power - a.power);

    // Define limits based on lanesCount
    const topCount = lanesCount === 3 ? 24 : 16;
    const perLaneLimit = 8;

    // Initialize empty lanes depending on lanesCount (3 lanes always)
    const lanes: { players: Player[], totalPower: number }[] = [
      { players: [], totalPower: 0 },
      { players: [], totalPower: 0 },
      { players: [], totalPower: 0 }
    ];

    const topPlayers = sorted.slice(0, topCount);

    for (const player of topPlayers) {

      let targetLaneIndex = lanes
        .slice(0, lanesCount)
        .reduce((minIndex, lane, index, arr) => {
          if (lane.players.length >= perLaneLimit) {
            // If lane full, ignore it (return current minIndex)
            return minIndex;
          }
          return lane.totalPower < arr[minIndex].totalPower ? index : minIndex;
        }, 0);

      player.lane = (targetLaneIndex + 1) as 1 | 2 | 3;

      lanes[targetLaneIndex].players.push(player);
      lanes[targetLaneIndex].totalPower += player.power;
    }

    if (lanesCount === 2) {
      const nextPlayers = sorted.slice(topCount, topCount + 8);
      for (const player of nextPlayers) {
        player.lane = 3;
        lanes[2].players.push(player);
        lanes[2].totalPower += player.power;
      }
    }

    const assignedPlayers = lanes.flatMap(lane => lane.players);
    for (const player of this.players) {
      if (!assignedPlayers.includes(player)) {
        player.lane = 0 as 0 | 1 | 2 | 3;
      }
    }

    this.savePlayers();
  }

  resetLanes() {
    for (const player of this.players) {
      player.lane = 0;
    }
    this.savePlayers();
  }

  resetAllPlayers() {
    if (confirm('Are you sure you want to delete ALL players? This action cannot be undone.')) {
      this.players = [];
      this.savePlayers();
    }
  }

  generateRandomPlayers(count: number = 30) {
    for (let i = 1; i <= count; i++) {
      const name = `Player${i}`;
      const power = Math.floor(Math.random() * (1200 - 600 + 1)) + 600;
      const gearset = Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3;
      this.addPlayer(name, power, 0, gearset);
    }
  }

  rotateGearset() {
    this.newPlayerGearset = (this.newPlayerGearset % 3 + 1) as 1 | 2 | 3;
  }
}
