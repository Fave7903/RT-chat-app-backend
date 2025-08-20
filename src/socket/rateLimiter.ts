export class MessageRateLimiter {
  private windows: Map<string, number[]> = new Map();
  constructor(
    private max: number,
    private windowMs: number,
  ) {}

  allow(key: string) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const arr = this.windows.get(key) || [];
    const recent = arr.filter((ts) => ts > windowStart);
    recent.push(now);
    this.windows.set(key, recent);
    return recent.length <= this.max;
  }
}
