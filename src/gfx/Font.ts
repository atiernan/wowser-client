class Font {
  path: string;
  font?: FontFace;

  constructor(path: string) {
    this.path = path;
  }

  static pathToName(path: string) {
    return path.replaceAll('\\', '_');
  }

  load(data: ArrayBuffer) {
    const name = Font.pathToName(this.path);
    this.font = new FontFace(name, data);
    document.fonts.add(this.font);
  }

  get isLoaded() {
    return this.font !== undefined;
  }
}

export default Font;
