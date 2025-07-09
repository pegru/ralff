type Callback = () => void;

export class PausableTimeout {
  callback: Callback;
  remainingTime: number;
  timeoutId: ReturnType<typeof setTimeout> | null = null;
  startTime: number | null;

  constructor(callback: Callback, delay: number) {
    this.callback = callback;
    this.remainingTime = delay;
    this.timeoutId = null;
    this.startTime = null;
  }

  start() {
    this.startTime = Date.now();
    // clear previous one
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.callback()
    }, this.remainingTime);
  }

  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      const elapsedTime = Date.now() - (this.startTime ?? Date.now());
      this.remainingTime -= elapsedTime;
      this.timeoutId = null;
    }
  }

  resume() {
    this.start();
  }

  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.remainingTime = 0;
  }
}