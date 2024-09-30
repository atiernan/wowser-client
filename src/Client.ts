import Device from './gfx/Device';
import WebGL2Device from './gfx/apis/webgl2/WebGL2Device';
import WebGPUDevice from './gfx/apis/webgpu/WebGPUDevice';
import Screen from './gfx/Screen';
import TextureRegistry from './gfx/TextureRegistry';
import FontRegistry from './gfx/FontRegistry';
import UIContext from './ui/UIContext';
import { fetch } from './utils';
import EventContext from './event/EventContext';
import SoundManager from './sound/SoundManager';

type ClientOptions = {
  api: 'webgl2' | 'webgpu' | string
}

class Client {
  static instance: Client;

  fetch: typeof fetch;
  device: Device;
  screen: Screen;
  textures: TextureRegistry;
  fonts: FontRegistry;
  ui: UIContext;
  events: EventContext;
  sound: SoundManager;

  constructor(canvas: HTMLCanvasElement, { api }: ClientOptions) {
    Client.instance = this;

    this.fetch = fetch;

    switch (api) {
      default:
      case 'webgl2':
        this.device = new WebGL2Device(canvas);
        break;
      case 'webgpu':
        this.device = new WebGPUDevice();
        break;
    }

    this.events = new EventContext();
    this.screen = new Screen(canvas);
    this.textures = new TextureRegistry();
    this.fonts = new FontRegistry();
    this.ui = new UIContext();
    this.sound = new SoundManager();
  }
}

export default Client;
