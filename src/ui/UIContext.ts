import { Status, enumRecordFor, path, stringToBoolean } from '../utils';
import DrawLayerType from './DrawLayerType';
import FactoryRegistry from './components/FactoryRegistry';
import FontString from './components/simple/FontString';
import Frame from './components/simple/Frame';
import LayoutFrame from './components/abstract/LayoutFrame';
import Renderer from './rendering/Renderer';
import UIRoot from './components/UIRoot';
import ScriptingContext from './scripting/ScriptingContext';
import TemplateRegistry from './TemplateRegistry';
import Texture from './components/simple/Texture';
import XMLNode from './XMLNode';
import EventContext from '../event/EventContext';
import { EventType, KeyBoardEvent, MouseEvent } from '../event/Events';
import FrameStrataType from './components/abstract/FrameStrataType';
import { FrameEvent, FrameEventHandlerLUT } from './FrameEvent';
import { VirtualFileSystem } from '../resources/fs/VirtualFileSystem';

class UIContext {
  static instance: UIContext;

  scripting: ScriptingContext;
  factories: FactoryRegistry;
  renderer: Renderer;
  templates: TemplateRegistry;
  root: UIRoot;
  mouseTarget: FrameEventHandlerLUT[FrameEvent.MOUSE] | null;
  eventTargets: Record<FrameStrataType, Record<FrameEvent, (FrameEventHandlerLUT[FrameEvent])[]>>;
  currentFocus: FrameEventHandlerLUT[FrameEvent.KEYBOARD] | null;
  #fs: VirtualFileSystem;

  constructor(fs: VirtualFileSystem) {
    UIContext.instance = this;

    this.#fs = fs;
    this.scripting = new ScriptingContext();
    this.factories = new FactoryRegistry();
    this.renderer = new Renderer();
    this.templates = new TemplateRegistry();

    this.root = new UIRoot();

    this.mouseTarget = null;
    this.currentFocus = null;
    this.eventTargets = enumRecordFor(FrameStrataType, (_type) => enumRecordFor(FrameEvent, (_event) => []));

    this.registerEvents();
  }

  getParentNameFor(node: XMLNode) {
    let parentName = node.attributes.get('parent');
    if (parentName) {
      return parentName;
    }

    const inherits = node.attributes.get('inherits');
    if (inherits) {
      const templates = this.templates.filterByList(inherits);
      for (const { template } of templates) {
        // TODO: Does this bit require lock/release of templates?
        if (template && !template.locked) {
          parentName = template.node.attributes.get('parent');
        }
      }
    }

    return parentName;
  }

  createFrame(node: XMLNode, parent: Frame | null, status = new Status()) {
    const name = node.attributes.get('name');
    if (name) {
      status.info(`creating ${node.name} named ${name}`);
    } else {
      status.info(`creating unnamed ${node.name}`);
    }

    const factory = this.factories.get(node.name);
    if (!factory) {
      status.warning(`no factory for frame type: ${node.name}`);
      return null;
    }

    const parentName = this.getParentNameFor(node);
    if (parentName) {
      parent = Frame.getObjectByName(parentName);
      if (!parent) {
        status.warning(`could not find frame parent: ${parentName}`);
      }
    }

    const frame = factory.build(parent);
    if (!frame) {
      status.warning(`unable to create frame type: ${node.name}`);
      return null;
    }

    // TODO: Handle unique factories
    frame.preLoadXML(node);
    frame.loadXML(node, status);
    frame.postLoadXML(node, status);

    return frame;
  }

  createFontString(node: XMLNode, frame: Frame, status = new Status()) {
    const fontString = new FontString(frame, DrawLayerType.ARTWORK, true);
    fontString.preLoadXML(node);
    fontString.loadXML(node, status);
    fontString.postLoadXML(node);
    return fontString;
  }

  createTexture(node: XMLNode, frame: Frame, status = new Status()) {
    const texture = new Texture(frame, DrawLayerType.ARTWORK, true);
    texture.preLoadXML(node);
    texture.loadXML(node, status);
    texture.postLoadXML(node);
    return texture;
  }

  async load(tocPath: string, status = new Status()) {
    status.info('loading toc', tocPath);

    const dirPath = path.dirname(tocPath);

    const toc = await this.#fs.fetchText(tocPath);
    if (!toc) {
      status.error(`could not open ${tocPath}`);
      return;
    }

    const lines = toc.split(/\r?\n/g);

    for (const line of lines) {
      if (!line || line.startsWith('#')) {
        continue;
      }

      const filePath = path.join(dirPath, line);
      await this.loadFile(filePath, status);
    }
  }

  async loadFile(filePath: string, status = new Status()) {
    status.info('loading file', filePath);

    const source = await this.#fs.fetchText(filePath);

    // Handle Lua files
    if (filePath.endsWith('.lua')) {
      return this.scripting.execute(source, filePath);
    }

    // Assume rest are XML files
    const node = XMLNode.parse(source);

    // TODO: Tainted code handling

    const dirPath = path.dirname(filePath);

    for (const child of node.children) {
      const { attributes, body } = child;

      const iname = child.name.toLowerCase();
      switch (iname) {
        case 'include': {
          const file = attributes.get('file');
          if (file) {
            // TODO: Is this legit?
            const includePath = path.join(dirPath, file);
            await this.loadFile(includePath);
          } else {
            status.error("element 'Include' without file attribute");
          }
          break;
        }
        case 'script': {
          const file = attributes.get('file');
          if (file) {
            // TODO: Is this legit?
            const luaPath = path.join(dirPath, file);
            await this.loadFile(luaPath);
          } else if (body) {
            this.scripting.execute(body, `${filePath}:<Scripts>`);
          }
          break;
        }
        // Other frame nodes
        default: {
          const name = attributes.get('name');
          const virtual = attributes.get('virtual');
          if (stringToBoolean(virtual)) {
            if (name) {
              this.templates.register(child, name, false, status);
            } else {
              status.warning('unnamed virtual node at top level');
            }
          } else if (iname === 'font') {
            status.error('fonts should always be virtual');
          } else {
            this.createFrame(child, null, status);
            LayoutFrame.resizePending();
          }
        }
      }
    }
  }

  // TODO: Break this out into a UIEventHandler
  private registerEvents() {
    EventContext.instance.on(EventType.MOUSEDOWN, this.onMouseDown.bind(this));
    EventContext.instance.on(EventType.MOUSEMOVE, this.onMouseMove.bind(this));
    EventContext.instance.on(EventType.MOUSEUP, this.onMouseUp.bind(this));
    EventContext.instance.on(EventType.KEYDOWN, this.onKeyDown.bind(this));
  }

  private onMouseDown(event: MouseEvent) {
    if (this.mouseTarget?.onMouseDown) {
      this.mouseTarget.onMouseDown(event);
    }
    this.currentFocus = this.mouseTarget;
  }

  private onMouseUp(event: MouseEvent) {
    if (this.mouseTarget?.onMouseUp) {
      this.mouseTarget.onMouseUp(event);
    }
  }

  private onMouseMove(event: MouseEvent) {
    const { x, y } = event;
    const oldTarget = this.mouseTarget;
    let nextTarget = null;
    for (let strata = FrameStrataType.TOOLTIP; strata >= FrameStrataType.WORLD; strata--) {
      for (const frame of this.eventTargets[strata][FrameEvent.MOUSE]) {
        if (frame.visible) {
          if (frame.containsPoint(x, y)) {
            nextTarget = frame;
            break;
          }
        }
      }
      if (nextTarget) {
        break;
      }
    }
    if (oldTarget != nextTarget) {
      this.mouseTarget = nextTarget;
    }
  }

  private onKeyDown(event: KeyBoardEvent) {
    if (this.currentFocus && this.currentFocus.onKeyDown) {
      this.currentFocus.onKeyDown({ key: event.key });
    }
  }

  enableEvent<E extends FrameEvent>(event: E, strata: FrameStrataType, target: FrameEventHandlerLUT[E] & Frame) {
    this.eventTargets[strata][event].push(target);
  }
}

export default UIContext;

