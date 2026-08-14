import { Component, computed, input, output } from '@angular/core';
import { Dice, DiceValue } from '../../shared/models';

@Component({
  selector: 'app-dice',
  imports: [],
  templateUrl: './dice.html',
  styleUrl: './dice.scss',
})
export class DiceComponent {
  constructor() {}

  dice = input<Dice>({
    id: 0,
    value: Math.floor(Math.random() * 6) + 1 as DiceValue,
    selected: false,
  });
  rolling = input<boolean>(false);
  held = input<boolean>(false);
  disabled = input<boolean>(false);

  diceClick = output<number>();

  /** Pip layout per face, as [x, y] grid coordinates on a 3x3 grid (0-2). */
  private readonly pipLayouts: Record<DiceValue, Array<[number, number]>> = {
    1: [[1, 1]],
    2: [
      [0, 0],
      [2, 2],
    ],
    3: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    4: [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ],
    5: [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ],
    6: [
      [0, 0],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
    ],
  };

  protected readonly pips = computed(() => this.pipLayouts[this.dice().value]);

  protected onClick(): void {
    if (this.disabled() || this.rolling()) {
      return;
    }
    this.diceClick.emit(this.dice().id);
  }
}
