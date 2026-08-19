import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle';
  opacity: number;
}

const COLORS = [
  '#f94144',
  '#f3722c',
  '#f8961e',
  '#f9c74f',
  '#90be6d',
  '#43aa8b',
  '#577590',
  '#277da1',
];

@Component({
  selector: 'app-confetti',
  standalone: true,
  template: `
    @if (visible()) {
      <canvas #canvas class="confetti-canvas"></canvas>
    }
  `,
  styles: [
    `
      .confetti-canvas {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
      }
    `,
  ],
})
export class Confetti implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef?: ElementRef<HTMLCanvasElement>;

  /** Steuert, ob das Canvas im DOM ist. */
  readonly visible = signal(false);

  private ctx?: CanvasRenderingContext2D;
  private pieces: ConfettiPiece[] = [];
  private animationFrameId?: number;
  private hideTimeoutId?: ReturnType<typeof setTimeout>;
  private resizeHandler = () => this.resizeCanvas();
  private startTime = 0;

  /** Dauer der Animation in ms, danach fadet sie aus und wird entfernt. */
  private durationMs = 5000;

  ngAfterViewInit(): void {
    // Canvas wird erst erzeugt, sobald visible() true ist -> siehe trigger().
    this.trigger()
  }

  ngOnDestroy(): void {
    this.stop();
  }

  /**
   * Startet die Fullscreen-Konfetti-Animation.
   * @param durationMs Gesamtdauer inkl. Fade-out (Standard 3500ms)
   * @param particleCount Anzahl der Konfetti-Partikel
   */
  trigger(durationMs = 3500, particleCount = 300): void {
    this.durationMs = durationMs;
    this.visible.set(true);

    // Canvas existiert erst nach dem nächsten Change-Detection-Zyklus im DOM.
    queueMicrotask(() => {
      const canvas = this.canvasRef?.nativeElement;
      if (!canvas) return;

      this.ctx = canvas.getContext('2d') ?? undefined;
      this.resizeCanvas();
      window.addEventListener('resize', this.resizeHandler);

      this.pieces = this.createPieces(particleCount, canvas.width, canvas.height);
      this.startTime = performance.now();

      if (this.hideTimeoutId) clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = setTimeout(() => this.stop(), this.durationMs);

      this.animate();
    });
  }

  private createPieces(
    count: number,
    canvasWidth: number,
    canvasHeight: number,
  ): ConfettiPiece[] {
    return Array.from({ length: count }, () => ({
      x: Math.random() * canvasWidth,
      // Verteilt über die gesamte Höhe (auch schon oberhalb sichtbar) statt
      // alles knapp über dem oberen Rand zu bündeln.
      y: -Math.random() * canvasHeight * 1.1,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 0.8 + Math.random() * 1.4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      opacity: 1,
    }));
  }

  private animate = (): void => {
    if (!this.ctx) return;
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elapsed = performance.now() - this.startTime;
    const fadeStart = this.durationMs - 500;

    for (const piece of this.pieces) {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += 0.012; // Schwerkraft (sanft, für langsameres Fallen)
      piece.rotation += piece.rotationSpeed;

      if (elapsed > fadeStart) {
        piece.opacity = Math.max(0, 1 - (elapsed - fadeStart) / 500);
      }

      this.drawPiece(piece);
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private drawPiece(piece: ConfettiPiece): void {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.translate(piece.x, piece.y);
    this.ctx.rotate((piece.rotation * Math.PI) / 180);
    this.ctx.globalAlpha = piece.opacity;
    this.ctx.fillStyle = piece.color;

    if (piece.shape === 'rect') {
      this.ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
    } else {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private stop(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.hideTimeoutId) clearTimeout(this.hideTimeoutId);
    window.removeEventListener('resize', this.resizeHandler);
    this.pieces = [];
    this.visible.set(false);
    this.ctx = undefined;
  }
}