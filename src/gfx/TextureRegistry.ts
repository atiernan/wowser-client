import { VirtualFileSystem } from '../resources/fs/VirtualFileSystem';
import { HashMap, HashStrategy } from '../utils';
import BLPTexture from './texture/BLPTexture';
import PNGTexture from './texture/PNGTexture';
import Texture from './texture/Texture';

class TextureRegistry extends HashMap<string, Texture> {
  #fs: VirtualFileSystem;

  constructor(fs: VirtualFileSystem) {
    super(HashStrategy.UPPERCASE);

    this.#fs = fs;
  }

  lookup(path: string) {
    // TODO: TGA support instead of PNG
    path = path.replace(/\.tga/i, '.png');
    let texture = this.get(path);
    if (!texture) {
      if (path.endsWith('.png')) {
        texture = new PNGTexture(path);
      } else {
        texture = new BLPTexture(path, this.#fs);
      }
      this.set(path, texture);
    }
    return texture;
  }
}

export default TextureRegistry;
