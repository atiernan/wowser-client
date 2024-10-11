import { VirtualFileSystem } from './VirtualFileSystem';

class HTTPFileSystem implements VirtualFileSystem {
  #baseUrl: string;
  #cache?: Cache;
  #cacheEnabled: boolean;

  constructor(baseUrl: string, cacheName?: string) {
    this.#baseUrl = baseUrl;
    this.#cacheEnabled = cacheName !== undefined;

    if (cacheName) {
      caches.open(cacheName).then((c) => {
        this.#cache = c;
      });
    }
  }

  async #rawFetch(path: string) {
    const resolvedPath = `${this.#baseUrl}${path}`;
    const request = new Request(resolvedPath);
    if (this.#cacheEnabled) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    const response = await fetch(resolvedPath);
    if (response.status === 200) {
      if (this.#cacheEnabled) {
        this.#cache?.put(request, response.clone());
      }
      return response;
    } else {
      throw new Error(`Could not load ${path}: ${response.statusText}`);
    }
  }

  async fetch(path: string) {
    const response = await this.#rawFetch(path);
    return response.arrayBuffer();
  }

  async fetchText(path: string) {
    const response = await this.#rawFetch(path);
    return response.text();
  }
}

export default HTTPFileSystem;
export { HTTPFileSystem };