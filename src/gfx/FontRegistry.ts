import { VirtualFileSystem } from '../resources/fs/VirtualFileSystem';
import { HashMap, HashStrategy } from '../utils';
import Font from './Font';

class FontRegistry extends HashMap<string, Font> {
  #fs: VirtualFileSystem;

  constructor(fs: VirtualFileSystem) {
    super(HashStrategy.UPPERCASE);

    this.#fs = fs;
  }

  lookup(path: string) {
    let font = this.get(path);
    if (!font) {
      font = new Font(path);
      this.set(path, font);
      this.#fs.fetch(path).then((fontData) => {
        font?.load(fontData);
      });
    }
    return font;
  }
}

export default FontRegistry;
