import DrawLayerType from '../../../../gfx/DrawLayerType';
import FrameStrataType from '../../abstract/FrameStrata/Type';
import Region from '../Region';
import Root from '../../Root';
import Script from '../../../scripting/Script';
import ScriptRegion from '../../abstract/ScriptRegion';
import UIContext from '../../../Context';
import {
  LinkedList,
  LinkedListLink,
  LinkedListNode,
  stringToBoolean,
} from '../../../../utils';

import FrameFlag from './Flag';
import * as scriptFunctions from './script';

class FrameNode extends LinkedListNode {
  constructor(frame) {
    super();

    this.frame = frame;
  }
}

class Frame extends ScriptRegion {
  static get scriptFunctions() {
    return scriptFunctions;
  }

  constructor(parent) {
    super();

    this.flags = 0;

    this.loading = false;
    this.shown = false;
    this.visible = false;
    this.strataType = FrameStrataType.MEDIUM;
    this.level = 0;

    this.regions = LinkedList.of(Region, 'regionLink');
    this.layers = LinkedList.of(Region, 'layerLink');
    this.children = LinkedList.of(FrameNode);

    this.framesLink = LinkedListLink.for(this);
    this.destroyedLink = LinkedListLink.for(this);
    this.strataLink = LinkedListLink.for(this);

    const root = Root.instance;
    root.register(this);

    this.parent = parent;

    this.scripts.register(
      new Script('OnLoad'),
      new Script('OnSizeChanged', ['w', 'h']),
      new Script('OnUpdate', ['elapsed']),
      new Script('OnShow'),
      new Script('OnHide'),
      new Script('OnEnter', ['motion']),
      new Script('OnLeave', ['motion']),
      new Script('OnMouseDown', ['button']),
      new Script('OnMouseUp', ['button']),
      new Script('OnMouseWheel', ['delta']),
      new Script('OnDragStart', ['button']),
      new Script('OnDragStop'),
      new Script('OnReceiveDrag'),
      new Script('OnChar', ['text']),
      new Script('OnKeyDown', ['key']),
      new Script('OnKeyUp', ['key']),
      new Script('OnAttributeChange', ['name', 'value']),
      new Script('OnEnable'),
      new Script('OnDisable'),
    );

    this.show();
  }

  setFrameFlag(flag, on) {
    if (on) {
      this.flags |= flag;
    } else {
      this.flags &= ~flag;
    }
  }

  setFrameLevel(level, shiftChildren) {
    console.error('TODO: frame level', level, shiftChildren, 'for', this);
  }

  setFrameStrataType(strataType) {
    if (this.strataType === strataType) {
      return;
    }

    const root = Root.instance;

    if (this.visible) {
      root.hideFrame(this, true);
    }

    this.strataType = strataType;

    if (this.visible) {
      root.showFrame(this, true);
    }

    for (const child of this.children) {
      child.frame.setFrameStrataType(strataType);
    }
  }

  // TODO: Seems to be necessary with split getter/setters + inheritance
  get parent() {
    return this._parent;
  }

  set parent(parent) {
    if (this._parent === parent) {
      return;
    }

    // TODO: Handle detachment of previous parent (if any)

    if (this.visible) {
      this.hideThis();
    }

    this._parent = parent;

    if (parent) {
      this.setFrameStrataType(parent.strataType);
      this.setFrameLevel(parent.level + 1, true);

      // TODO: Alpha and scrolling adjustments
    } else {
      this.setFrameStrataType(FrameStrataType.MEDIUM);
      this.setFrameLevel(0, true);

      // TODO: Alpha and scrolling adjustments
    }

    if (parent) {
      // TODO: Parent attachment protection
      const node = new FrameNode(this);
      parent.children.linkToHead(node);
    }

    if (this.shown) {
      if (!parent || parent.visible) {
        this.showThis();
      }
    }
  }

  preLoadXML(node) {
    super.preLoadXML(node);

    const id = node.attributes.get('id');
    if (id) {
      const idValue = parseInt(id, 10);
      if (idValue >= 0) {
        this.id = idValue;
      }
    }

    this.loading = true;
    this.shown = false;

    this.deferredResize = true;

    // TODO: Handle deferred resize for title region

    for (const region of this.regions) {
      region.deferredResize = true;
    }
  }

  loadXML(node) {
    const dontSavePosition = node.attributes.get('dontSavePosition');
    const frameLevel = node.attributes.get('frameLevel');
    const frameStrata = node.attributes.get('frameStrata');
    const hidden = node.attributes.get('hidden');
    const inherits = node.attributes.get('inherits');
    const movable = node.attributes.get('movable');
    const resizable = node.attributes.get('resizable');
    const toplevel = node.attributes.get('toplevel');

    if (inherits) {
      const templates = UIContext.instance.templates.filterByList(inherits);
      for (const template of templates) {
        if (template) {
          if (template.locked) {
            // TODO: Error handling
          } else {
            template.lock();
            this.loadXML(template.node);
            template.release();
          }
        } else {
          // TODO: Error handling
        }
      }
    }

    super.loadXML(node);

    if (hidden) {
      if (stringToBoolean(hidden)) {
        this.hide();
      } else {
        this.show();
      }
    }

    if (toplevel) {
      this.setFrameFlag(FrameFlag.TOPLEVEL, stringToBoolean(toplevel));
    }

    if (movable) {
      this.setFrameFlag(FrameFlag.MOVABLE, stringToBoolean(toplevel));
    }

    if (dontSavePosition) {
      this.setFrameFlag(FrameFlag.DONT_SAVE_POSITION, stringToBoolean(dontSavePosition));
    }

    if (resizable) {
      this.setFrameFlag(FrameFlag.RESIZABLE, stringToBoolean(resizable));
    }

    if (frameStrata) {
      const strataType = FrameStrataType[frameStrata];
      if (strataType) {
        this.setFrameStrataType(strataType);
      } else {
        // TODO: Error handling
      }
    }

    if (frameLevel) {
      const level = parseInt(frameLevel, 10);

      if (level > 0) {
        this.setFrameLevel(level, true);
      } else {
        // TODO: Error handling
      }
    }

    // TODO: Alpha

    // TODO: Enable mouse events

    // TODO: Enable keyboard events

    // TODO: Clamped to screen behaviour

    // TODO: Protected

    // TODO: Depth

    for (const child of node.children) {
      const iname = child.name.toLowerCase();
      switch (iname) {
        // TODO: TitleRegion, ResizeBounds, Backdrop & HitRectInsects
        case 'layers':
          this.loadXMLLayers(child);
          break;
        case 'attributes':
          // TODO: Load attributes
          break;
        case 'scripts':
          this.loadXMLScripts(child);
          break;
      }
    }
  }

  loadXMLLayers(node) {
    const ui = UIContext.instance;

    for (const layer of node.children) {
      if (layer.name.toLowerCase() !== 'layer') {
        // TODO: Error handling
        continue;
      }

      const level = layer.attributes.get('level');

      // TODO: Case sensitivity
      const drawLayerType = DrawLayerType[level] || DrawLayerType.ARTWORK;

      for (const layerChild of layer.children) {
        const iname = layerChild.name.toLowerCase();
        switch (iname) {
          case 'texture':
            const texture = ui.createTexture(layerChild, this);
            texture.setFrame(this, drawLayerType, texture.shown);
            break;
          case 'fontstring':
            const fontstring = ui.createFontString(layerChild, this);
            fontstring.setFrame(this, drawLayerType, fontstring.shown);
            break;
          default:
            // TODO: Error handling
        }
      }
    }
  }

  loadXMLScripts(node) {
    for (const child of node.children) {
      const script = this.scripts.get(child.name);
      if (script) {
        script.loadXML(child);

        // TODO: Register for events
      } else {
        // TOOD: Error handling
        console.error(`frame ${this.name}: unknown script element ${child.name}`);
      }
    }
  }

  postLoadXML(node, status) {
    this.loading = false;

    // TODO: More stuff

    if (this.visible) {
      this.deferredResize = false;

      if (this.titleRegion) {
        this.titleRegion.deferredResize = false;
      }

      for (const region of this.regions) {
        region.deferredResize = false;
      }
    }

    this.postLoadXMLFrames(node, status);

    // TODO: Alpha animations

    this.runOnLoadScript();

    if (this.visible) {
      this.runOnShowScript();
    }
  }

  postLoadXMLFrames(node) {
    const ui = UIContext.instance;

    const inherits = node.attributes.get('inherits');
    if (inherits) {
      const templates = ui.templates.filterByList(inherits);
      for (const template of templates) {
        if (template && !template.locked) {
          this.postLoadXMLFrames(template.node);
        }
      }
    }

    const frames = node.getChildByName('Frames');
    if (frames) {
      for (const frame of frames.children) {
        ui.createFrame(frame, this);
      }
    }
  }

  show() {
    if (this.protectedFunctionsAllowed) {
      this.shown = true;
      this.showThis();
    } else {
      // TODO
    }
  }

  showThis() {
    if (!this.shown) {
      return false;
    }

    if (this.parent && !this.parent.visible) {
      return false;
    }

    if (this.visible) {
      return true;
    }

    if (!this.loading) {
      this.deferredResize = false;

      // TODO: Is this correct?
      if (this.titleRegion) {
        this.titleRegion.deferredResize = false;
      }
    }

    const root = Root.instance;

    this.visible = true;

    root.showFrame(this, 0);

    for (const region of this.regions) {
      region.showThis();
    }

    for (const child of this.children) {
      child.frame.showThis();
    }

    if (this.flags & 0x1) {
      root.raiseFrame(this, 1);
    }

    this.onLayerShow();

    return true;
  }

  hide() {
    if (this.protectedFunctionsAllowed) {
      this.shown = false;
      this.hideThis();
    } else {
      // TODO
    }
  }

  hideThis() {
    if (!this.visible) {
      return true;
    }

    if (!this.loading) {
      this.deferredResize = true;

      if (this.titleRegion) {
        this.titleRegion.deferredResize = true;
      }
    }

    this.visible = false;
    Root.instance.hideFrame(this, false);

    for (const region of this.regions) {
      region.hideThis();
    }

    for (const child of this.children) {
      child.frame.hideThis();
    }

    this.onLayerHide();

    return true;
  }

  onLayerShow() {
    this.runOnShowScript();
  }

  onLayerHide() {
    this.runOnHideScript();
  }

  onLayerUpdate(elapsedSecs) {
    // TODO: Run update script

    // TODO: Run PreOnAnimUpdate hooks

    // TODO: Implement ScriptRegion.onLayerUpdate
    // super.onLayerUpdate(elapsedSecs);

    for (const region of this.regions) {
      region.onLayerUpdate(elapsedSecs);
    }
  }

  runOnHideScript() {
    if (!this.loading) {
      this.runScript('OnHide');
    }
  }

  runOnLoadScript() {
    this.runScript('OnLoad');
  }

  runOnShowScript() {
    if (!this.loading) {
      this.runScript('OnShow');
    }
  }
}

export default Frame;
