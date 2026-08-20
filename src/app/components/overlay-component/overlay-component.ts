import { Component, Type, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-overlay',
  imports: [NgComponentOutlet],
  templateUrl: './overlay-component.html',
  styleUrl: './overlay-component.scss',
})
export class OverlayComponent {
  isOpen = signal(false);
  component = signal<Type<unknown> | null>(null);
  componentInputs = signal<Record<string, unknown>>({});

  open(component: Type<unknown>, inputs: Record<string, unknown> = {}) {
    this.component.set(component);
    this.componentInputs.set(inputs);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.component.set(null);
  }
}