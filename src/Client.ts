import Device from './gfx/Device';
import WebGL2Device from './gfx/apis/webgl2/WebGL2Device';
import WebGPUDevice from './gfx/apis/webgpu/WebGPUDevice';
import Screen from './gfx/Screen';
import TextureRegistry from './gfx/TextureRegistry';
import FontRegistry from './gfx/FontRegistry';
import UIContext from './ui/UIContext';
import EventContext from './event/EventContext';
import { VirtualFileSystem } from './resources/fs/VirtualFileSystem';

type ClientOptions = {
  api: 'webgl2' | 'webgpu' | string;
  fs: VirtualFileSystem;
}

type ResponseBodyType = 'arrayBuffer' | 'text';

class Client {
  static instance: Client;

  fetch: (path: string, bodyType: ResponseBodyType) => Promise<string | ArrayBuffer>;
  device: Device;
  screen: Screen;
  textures: TextureRegistry;
  fonts: FontRegistry;
  ui: UIContext;
  events: EventContext;
  sound: SoundManager;
  fs: VirtualFileSystem;

  constructor(canvas: HTMLCanvasElement, { api, fs }: ClientOptions) {
    Client.instance = this;

    // TODO: Legacy, everything should use the filesystem directly
    this.fetch = (path: string, bodyType?: ResponseBodyType) => {
      if (bodyType === 'arrayBuffer') {
        return this.fs.fetch(path);
      } else if (bodyType === 'text' || bodyType === undefined) {
        return this.fs.fetchText(path);
      }
      throw new Error(`Unsupported body type ${bodyType}`);
    };

    switch (api) {
      default:
      case 'webgl2':
        this.device = new WebGL2Device(canvas);
        break;
      case 'webgpu':
        this.device = new WebGPUDevice();
        break;
    }

    this.fs = fs;
    this.events = new EventContext();
    this.screen = new Screen(canvas);
    this.textures = new TextureRegistry(this.fs);
    this.fonts = new FontRegistry(this.fs);
    this.ui = new UIContext(this.fs);
    this.sound = new SoundManager();
  }
}

export default Client;
