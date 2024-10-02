import { Blp, BLP_IMAGE_FORMAT } from '@wowserhq/format';
import type Texture from './Texture';
import { VirtualFileSystem } from '../../resources/fs/VirtualFileSystem';

class BLPTexture implements Texture {
  #blp?: Blp;
  #imageData: ArrayBuffer;

  constructor(path: string, fs: VirtualFileSystem) {
    if (!path.endsWith('.blp')) {
      path += '.blp';
    }
    
    fs.fetch(path).then(async (buffer) => {
      if (buffer.byteLength > 0) {
        this.#blp = new Blp();
        this.#blp.load(buffer);
        this.#imageData = this.#blp.getImage(0, BLP_IMAGE_FORMAT.IMAGE_ABGR8888).data;
      }
    });
  }

  get width() {
    return this.#blp?.width ?? 0;
  }

  get height() {
    return this.#blp?.height ?? 0;
  }

  get image() {
    if (this.#blp === undefined) {
      throw new Error('Tried to load BLP texture before it was loaded');
    }
    return this.#imageData;
  }

  get isLoaded() {
    return this.#blp !== undefined;
  }
}

export default BLPTexture;
