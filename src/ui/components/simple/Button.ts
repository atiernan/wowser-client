import DrawLayerType from '../../DrawLayerType';
import Script from '../../scripting/Script';
import UIContext from '../../UIContext';
import XMLNode from '../../XMLNode';
import { BlendMode } from '../../../gfx/types';
import { Status } from '../../../utils';

import ButtonState from './ButtonState';
import FontString from './FontString';
import Frame from './Frame';
import Texture from './Texture';

import * as scriptFunctions from './Button.script';
import Font from './Font';
import { FrameEvent } from '../../FrameEvent';

class Button extends Frame {
  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  textures: Record<ButtonState, Texture | null>;
  fonts: Record<ButtonState, Font | null>;

  activeTexture: Texture | null;
  highlightTexture: Texture | null;

  fontString: FontString | null;

  state: ButtonState;

  constructor(parent: Frame | null) {
    super(parent);

    this.scripts.register(
      new Script('PreClick', ['button', 'down']),
      new Script('OnClick', ['button', 'down']),
      new Script('PostClick', ['button', 'down']),
      new Script('OnDoubleClick', ['button']),
    );

    this.textures = {
      [ButtonState.DISABLED]: null,
      [ButtonState.NORMAL]: null,
      [ButtonState.PUSHED]: null,
    };
    this.fonts = {
      [ButtonState.DISABLED]: null,
      [ButtonState.NORMAL]: null,
      [ButtonState.PUSHED]: null,
    };

    this.activeTexture = null;
    this.highlightTexture = null;

    this.fontString = null;

    this.state = ButtonState.NORMAL;
    this.enableEvent(FrameEvent.MOUSE);
  }

  loadXML(node: XMLNode, status: Status) {
    const text = node.attributes.get('text');
    super.loadXML(node, status);

    this.fontString?.setText(text ?? '');

    const ui = UIContext.instance;

    for (const child of node.children) {
      const iname = child.name.toLowerCase();
      switch (iname) {
        case 'normaltexture': {
          const texture = ui.createTexture(child, this, status);
          this.setStateTexture(ButtonState.NORMAL, texture);
          break;
        }
        case 'pushedtexture': {
          const texture = ui.createTexture(child, this, status);
          this.setStateTexture(ButtonState.PUSHED, texture);
          break;
        }
        case 'disabledtexture': {
          const texture = ui.createTexture(child, this, status);
          this.setStateTexture(ButtonState.DISABLED, texture);
          break;
        }
        case 'highlighttexture': {
          const texture = ui.createTexture(child, this, status);
          // TODO: Blend mode
          this.setHighlight(texture, null);
          break;
        }
        case 'normalfont': {
          if (child.attributes.has('style')) {
            const font = new Font();
            font.loadTemplate(child.attributes.get('style') ?? '');
            this.setStateFont(ButtonState.NORMAL, font);
          }
          break;
        }
        case 'disabledfont': {
          if (child.attributes.has('style')) {
            const font = new Font();
            font.loadTemplate(child.attributes.get('style') ?? '');
            this.setStateFont(ButtonState.DISABLED, font);
          }
          break;
        }
        case 'HighlightFont': {
          if (child.attributes.has('style')) {
            const font = new Font();
            font.loadTemplate(child.attributes.get('style') ?? '');
            this.setStateFont(ButtonState.PUSHED, font);
          }
          break;
        }
        case 'buttontext':
          this.fontString = ui.createFontString(child, this);
          this.fontString.setFrame(this, DrawLayerType.OVERLAY, true);
          break;
      }
    }

    // TODO: Text, click registration and motion scripts
  }

  changeState(newState: ButtonState) {
    this.state = newState;
    this.activeTexture?.hide();
    this.activeTexture = this.textures[this.state];
    this.activeTexture?.show();
    if (this.fonts[newState]) {
      this.fontString?.setFont(this.fonts[newState]);
    }
  }

  showThis(): boolean {
    const result = super.showThis();
    this.fontString?.show();
    return result;
  }

  setHighlight(texture: Texture, _blendMode: BlendMode | null) {
    if (this.highlightTexture === texture) {
      return;
    }

    if (this.highlightTexture) {
      // TODO: Destructor
    }

    if (texture) {
      texture.setFrame(this, DrawLayerType.HIGHLIGHT, true);
      // TODO: Blend mode
    }

    this.highlightTexture = texture;
  }

  setStateFont(state: ButtonState, font: Font) {
    this.fonts[state] = font;
    if (this.state === state) {
      this.fontString?.setFont(font);
    }
  }

  setStateTexture(state: ButtonState, texture: Texture) {
    const stored = this.textures[state];
    if (stored === texture) {
      return;
    }

    if (stored === this.activeTexture) {
      this.activeTexture = null;
    }

    if (stored) {
      // TODO: Destructor
    }

    if (texture) {
      texture.setFrame(this, DrawLayerType.ARTWORK, false);
    }

    this.textures[state] = texture;

    if (texture && state === this.state) {
      this.activeTexture = texture;
      texture.show();
    }
  }

  onClick() {
    this.runScript('OnClick');
  }

  onMouseDown() {
    if (this.state === ButtonState.NORMAL) {
      this.changeState(ButtonState.PUSHED);
      this.onClick();
    }
  }

  onMouseUp() {
    if (this.state === ButtonState.PUSHED) {
      this.changeState(ButtonState.NORMAL);
    }
  }
}

export default Button;
