import { HashMap, HashStrategy } from '../utils';
import Font from './Font';

class FontRegistry extends HashMap<string, Font> {
  constructor() {
    super(HashStrategy.UPPERCASE);
  }

  lookup(path: string) {
    let font = this.get(path);
    if (!font) {
      font = new Font(path);
      this.set(path, font);
    }
    return font;
  }
}

export default FontRegistry;
