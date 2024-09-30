import fetch from '../utils/fetch';

class Font {
  path: string;
  font?: FontFace;

  constructor(path: string) {
    this.path = path;
    fetch(path, 'arrayBuffer').then((buffer: Uint8Array) => {
      this.font = new FontFace(path, buffer);
      document.fonts.add(this.font);
    });
  }

  get isLoaded() {
    return this.font !== undefined;
  }
}

export default Font;
