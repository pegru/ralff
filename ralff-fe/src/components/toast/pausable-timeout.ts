export class PausableTimeout {
  callback: () => void;
  remainingTime: number;
  timeoutId: number | null;
  startTime: number | null;

  constructor(callback, delay) {
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
      const elapsedTime = Date.now() - this.startTime;
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