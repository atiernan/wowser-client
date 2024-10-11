import RenderBatch from '../../rendering/RenderBatch';
import XMLNode from '../../XMLNode';
import Region from './Region';
import * as scriptFunctions from './FontString.script';
import { maxAspectCompensation } from '../../../utils';
import FontTexture from '../../../gfx/texture/FontTexture';
import { BlendMode } from '../../../gfx/types';
import { Rect, Vector2, Vector3 } from '../../../math';
import { TextureCoords, TexturePosition } from './Texture';
import TextureImageMode from './TextureImageMode';
import WebGL2Device from '../../../gfx/apis/webgl2/WebGL2Device';
import Device from '../../../gfx/Device';
import Shader from '../../../gfx/Shader';
import Frame from './Frame';
import DrawLayerType from '../../DrawLayerType';
import ScriptingContext from '../../scripting/ScriptingContext';
import { lua_getglobal, lua_isstring, lua_pop, lua_tojsstring } from '../../scripting/lua';
import Font from './Font';

// TODO: Multi inherit from both Region and Fontable
class FontString extends Region {
  text: string = '';
  renderedText?: FontTexture;
  font: Font;
  position: TexturePosition;
  shader: Shader;
  explicitSize: boolean;

  static indices = [
    0, 1, 2,
    2, 1, 3,
  ];
  static coords: TextureCoords = [
    new Vector2([0, 0]),
    new Vector2([0, 1]),
    new Vector2([1, 0]),
    new Vector2([1, 1]),
  ];

  constructor(frame: Frame, drawLayerType: DrawLayerType, show: boolean) {
    super(frame, drawLayerType, show);

    this.position = [
      new Vector3(),
      new Vector3(),
      new Vector3(),
      new Vector3(),
    ];
    this.shader = (Device.instance as WebGL2Device).shaders.pixelShaderFor(TextureImageMode.UI);
    this.font = new Font();
    this.explicitSize = false;
  }

  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  preLoadXML(node: XMLNode): void {
    //this.font.preLoadXML(node);
    super.preLoadXML(node);
  }

  postLoadXML(_node: XMLNode) {
    this.explicitSize = this._width !== undefined && this._width > 0 && this._height > 0 && this._height !== undefined;
    this.setText(_node.attributes.get('text') ?? '', false);
    this.font.loadXML(_node);
    this.renderText();
  }

  renderText() {
    const width = this._width * (maxAspectCompensation);
    const height = this._height * maxAspectCompensation;
    if (this.font) {
      if (this.renderedText === undefined) {
        this.renderedText = new FontTexture(this.text, this.font, width, height);
      } else {
        this.renderedText.font = this.font;
        this.renderedText.setText(this.text);
      }
      if (!this.explicitSize) {
        this.width = this.renderedText.width / maxAspectCompensation;
        this.height = this.renderedText.height / maxAspectCompensation;
        this.onFrameResize();
      }
    }
  }

  setFont(font: Font) {
    this.font = font;
    this.renderText();
  }

  setTextRaw(text: string, rerender: boolean = true) {
    this.text = text;
    if (rerender) {
      this.renderText();
    }
  }

  setText(text: string, rerender: boolean = true) {
    const L = ScriptingContext.instance.state;
    try {
      lua_getglobal(L, text);
      if (lua_isstring(L, 1)) {
        text = lua_tojsstring(L, 1);
      }
      lua_pop(L, 1);
    } catch (e) {
      // If the Lua variable doesn't exist the exception is thrown and we fallback to the text passed in
    }
    this.setTextRaw(text, rerender);
  }

  setPosition(rect: Rect) {
    this.position[0].setElements(rect.minX, rect.maxY, this.layoutDepth);
    this.position[1].setElements(rect.minX, rect.minY, this.layoutDepth);
    this.position[2].setElements(rect.maxX, rect.maxY, this.layoutDepth);
    this.position[3].setElements(rect.maxX, rect.minY, this.layoutDepth);
  }

  onFrameSizeChanged(rect: Rect) {
    super.onFrameSizeChanged(rect);

    this.setPosition(this.rect);
  }

  draw(_batch: RenderBatch) {
    if (this.text !== undefined && this.text !== '' && this.renderedText) {
      _batch.queue(this.renderedText, BlendMode.Alpha, this.position, FontString.coords, [], FontString.indices, this.shader);
    }
  }
}

export default FontString;
