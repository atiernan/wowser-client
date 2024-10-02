import { VirtualFileSystem } from './VirtualFileSystem';

class HTTPFileSystem implements VirtualFileSystem {
  readonly #baseUrl: string;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
  }

  async #rawFetch(path: string) {
    const resolvedPath = `${this.#baseUrl}${path}`;
    const response = await fetch(resolvedPath);
    if (response.status === 200) {
      return response;
    } else {
      throw new Error(`Could not load ${path}: ${response.statusText}`);
    }
  }

  async fetch(path: string) {
    const response = await this.#rawFetch(path);
    return response.arrayBuffer();
  }

  async fetchText(path: string): Promise<string> {
    const response = await this.#rawFetch(path);
    return response.text();
  }
}

export default HTTPFileSystem;