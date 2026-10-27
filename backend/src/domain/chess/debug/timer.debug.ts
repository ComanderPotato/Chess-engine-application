export class Timer {
  private static _timers: Timer[] = [];
  private _timerIndex: number;
  private _timerName: string;
  private _startTime: number | null = null;
  private _elapsed = 0;

  constructor(timerName: string) {
    this._timerName = timerName;
    this._timerIndex = Timer._timers.length;
    Timer._timers.push(this);
  }
  public static resetAll(): void {
    for (const timer of Timer._timers) {
      timer.reset();
    }
  }
  static get timers(): Timer[] {
    return Timer._timers;
  }
  reset(): void {
    this._startTime = null;
    this._elapsed = 0;
  }

  startTimer(): void {
    if (this._startTime !== null) return;
    this._startTime = performance.now();
  }

  stopTimer(): void {
    if (this._startTime === null) return;

    Timer._timers[this._timerIndex]!._elapsed +=
      performance.now() - this._startTime;
    this._startTime = null;
  }

  elapsedTime(): number {
    return Timer._timers[this._timerIndex]!._elapsed;
  }

  printElapsedTime(): void {
    console.log(
      `Elapsed time for ${this._timerName}: ${this.elapsedTime().toFixed(3)} ms`,
    );
  }
}
