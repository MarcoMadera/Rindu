import { LYRICS_PIP_HEADER_HEIGH } from "./constants";
import { easeInOutCubic } from "./easeInOutCubic";

export class Circle {
  position: number;
  scale: number;
  x: number;
  targetX: number;
  y: number;
  appearing: boolean;
  moving: boolean;
  disappearing: boolean;
  animationProgress: number;
  startX: number;
  color: string;
  canvas: HTMLCanvasElement;
  radius: number;
  spacing: number;
  duration: number;

  constructor(
    canvas: HTMLCanvasElement,
    color: string,
    radius: number,
    position: number,
    spacing: number,
    duration: number,
    startFullSize = false
  ) {
    this.canvas = canvas;
    this.color = color;
    this.radius = radius;
    this.position = position;
    this.spacing = spacing;
    this.duration = duration;
    this.scale = startFullSize ? 1 : 0;
    this.x = this.getXForPosition(canvas, position);
    this.targetX = this.x;
    this.y = canvas.height / 2;
    this.appearing = !startFullSize;
    this.moving = false;
    this.disappearing = false;
    this.animationProgress = 0;
    this.startX = this.x;
  }

  getXForPosition(canvas: HTMLCanvasElement, pos: number): number {
    const startX = canvas.width / 2 - this.spacing;
    return startX + pos * this.spacing;
  }

  update(deltaTime: number): boolean {
    const animationSpeed = 2.5 * (deltaTime / this.duration);

    if (this.appearing) {
      this.animationProgress = Math.min(
        1,
        this.animationProgress + animationSpeed
      );
      this.scale = easeInOutCubic(this.animationProgress);
      if (this.animationProgress >= 1) {
        this.appearing = false;
        this.animationProgress = 0;
      }
    }

    if (this.moving) {
      this.animationProgress = Math.min(
        1,
        this.animationProgress + animationSpeed
      );
      const easedProgress = easeInOutCubic(this.animationProgress);
      this.x = this.startX + (this.targetX - this.startX) * easedProgress;

      if (this.animationProgress >= 1) {
        this.x = this.targetX;
        this.moving = false;
        this.animationProgress = 0;
      }
    }

    if (this.disappearing) {
      this.animationProgress = Math.min(
        1,
        this.animationProgress + animationSpeed
      );
      this.scale = 1 - easeInOutCubic(this.animationProgress);

      if (this.animationProgress >= 1) {
        return true;
      }
    }

    return false;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.globalCompositeOperation = "source-over";

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * this.scale, 0, Math.PI * 2);

    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.restore();
  }

  moveTo(newPosition: number): void {
    this.position = newPosition;
    this.startX = this.x;
    this.targetX = this.getXForPosition(this.canvas, newPosition);
    this.moving = true;
    this.animationProgress = 0;
  }
}

export class LoadingAnimation {
  circles: Circle[];
  lastTime: number;
  timeSinceLastAction: number;
  waitTime: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  backgroundColor: string;
  textColor: string;

  constructor(
    waitTime: number,
    canvas: HTMLCanvasElement,
    backgroundColor: string,
    textColor: string
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.waitTime = waitTime;
    this.lastTime = 0;
    this.timeSinceLastAction = this.waitTime;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;

    this.circles = [
      new Circle(canvas, textColor, 13, 0, 40, 1800, true),
      new Circle(canvas, textColor, 13, 1, 40, 1800, true),
      new Circle(canvas, textColor, 13, 2, 40, 1800, false),
    ];

    const lastCircle = this.circles[2];
    lastCircle.disappearing = true;

    this.circles.slice(0, 2).forEach((circle, index) => {
      circle.moveTo(index + 1);
    });

    this.circles.push(new Circle(canvas, textColor, 13, 0, 40, 1800));
  }

  update(deltaTime: number): void {
    this.timeSinceLastAction += deltaTime;

    this.circles = this.circles.filter((circle) => !circle.update(deltaTime));

    if (this.timeSinceLastAction >= this.waitTime) {
      if (!this.circles.some((c) => c.moving)) {
        const lastCircle = this.circles.find((c) => c.position === 2);
        if (lastCircle && !lastCircle.disappearing) {
          lastCircle.disappearing = true;
          this.circles
            .filter((c) => c.position < 2)
            .forEach((circle) => {
              circle.moveTo(circle.position + 1);
            });
          this.circles.push(
            new Circle(this.canvas, this.textColor, 13, 0, 40, 1800)
          );
        }
      }

      if (!this.circles.some((c) => c.moving || c.appearing)) {
        this.timeSinceLastAction = 0;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(
      0,
      LYRICS_PIP_HEADER_HEIGH,
      this.canvas.width,
      this.canvas.height - LYRICS_PIP_HEADER_HEIGH
    );

    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(
      0,
      LYRICS_PIP_HEADER_HEIGH,
      this.canvas.width,
      this.canvas.height - LYRICS_PIP_HEADER_HEIGH
    );

    this.circles.forEach((circle) => circle.draw(ctx));
  }

  animate(currentTime: number): number {
    const deltaTime = this.lastTime ? currentTime - this.lastTime : 0;
    this.lastTime = currentTime;

    this.update(deltaTime);
    if (this.ctx) {
      this.draw(this.ctx);
    }

    return requestAnimationFrame(this.animate.bind(this));
  }

  cleanup(): void {
    if (this.ctx) {
      const centerY = this.canvas.height / 2;
      this.ctx.clearRect(0, centerY - 30, this.canvas.width, 60);
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, centerY - 30, this.canvas.width, 60);
    }
    this.circles = [];
  }
}
