class Font {
  path: string;
  font?: FontFace;

  constructor(path: string) {
    this.path = path;
  }

  load(data: ArrayBuffer) {
    this.font = new FontFace(this.path, data);
    document.fonts.add(this.font);
  }

  get isLoaded() {
    return this.font !== undefined;
  }
}

export default Font;
