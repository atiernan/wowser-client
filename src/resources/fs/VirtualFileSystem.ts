export interface VirtualFileSystem {
  fetch(path: string): Promise<ArrayBuffer>;
  fetchText(path: string): Promise<string>;
}