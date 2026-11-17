// filepath: apps/bff/src/cache.ts
// Small in-memory TTL cache with tags and stale-on-error.
// One BFF instance in the POC. Swap for Redis when we run more than one.

type Entry<T> = { value: T; expires: number; tags: string[] };

export class TaggedCache {
  private store = new Map<string, Entry<unknown>>();

  constructor(private ttlMs: number) {}

  /** Returns a fresh value, or calls `load`. If `load` fails, serves the stale value if one exists. */
  async wrap<T>(key: string, tags: string[], load: () => Promise<T>): Promise<T> {
    const hit = this.store.get(key) as Entry<T> | undefined;
    if (hit && hit.expires > Date.now()) return hit.value;
    try {
      const value = await load();
      this.store.set(key, { value, expires: Date.now() + this.ttlMs, tags });
      return value;
    } catch (err) {
      if (hit) return hit.value;
      throw err;
    }
  }

  invalidate(tags: string[]): number {
    let n = 0;
    for (const [key, entry] of this.store) {
      if (entry.tags.some((t) => tags.includes(t))) {
        this.store.delete(key);
        n++;
      }
    }
    return n;
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}
