import type Texture from './Texture';
import Font, { FontHorizontalAlignment, FontVerticalAlignment } from '../../ui/components/simple/Font';

const SCALE = 1;

class FontTexture implements Texture {
  text: string;
  font: Font;
  renderedTexture: Uint8ClampedArray;
  _width?: number;
  _height?: number;
  explicitSize: boolean;

  constructor(text: string, font: Font, width?: number, height?: number) {
    this.text = text;
    this.font = font;
    this._width = width;
    this._height = height;
    this.explicitSize = width !== undefined && height !== undefined && width >= 1 && height >= 1;

    this.render();
  }

  setText(text: string) {
    this.text = text;
    this.render();
  }

  private get fontString() {
    return `${this.font.height * SCALE}px "${this.font.font?.font?.family ?? 'sans serif'}"`;
  }

  private calculateRenderedSize() {
    if (this.text === '') {
      this._width = 1;
      this._height = this.font.height;
      return;
    }

    const textSizeCanvas = new OffscreenCanvas(1, 1);
    const tmpCtx = textSizeCanvas.getContext('2d');
    if (!tmpCtx) {
      throw new Error('Failed to create font metrics canvas');
    }
    tmpCtx.font = this.fontString;
    const size = tmpCtx?.measureText(this.text);
    this._width = size?.width ?? 1;
    this._height = this.font.height;
  }

  private render() {
    if (!this.explicitSize) {
      this.calculateRenderedSize();
    }

    if (this._width === undefined || this._height === undefined) {
      throw new Error('Attempt to render text with unknown dimensions');
    }

    const canvas = new OffscreenCanvas(this._width * SCALE, this._height * SCALE);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not generate fontstring texture');
    }

    const { r, g, b, a } = this.font.color;

    //ctx.fillStyle = 'white';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.font = this.fontString;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetY = -1;
    ctx.shadowOffsetX = 1;

    let xOffset = 0;
    let yOffset = 0;
    switch (this.font.verticalAlignment) {
      case FontVerticalAlignment.MIDDLE:
        ctx.textBaseline = 'middle';
        yOffset = this._height / 2;
        break;
      case FontVerticalAlignment.BOTTOM:
        ctx.textBaseline = 'bottom';
        yOffset = this._height;
        break;
      case FontVerticalAlignment.TOP:
        ctx.textBaseline = 'top';
        yOffset = 0;
        break;
    }
    switch (this.font.horizontalAlignment) {
      case FontHorizontalAlignment.CENTER: 
        xOffset = this._width / 2;
        ctx.textAlign = 'center';
        break;
      case FontHorizontalAlignment.RIGHT:
        xOffset = this._width;
        ctx.textAlign = 'right';
        break;
      case FontHorizontalAlignment.LEFT:
        xOffset = 0;
        ctx.textAlign = 'left';
        break;
    }

    ctx.fillText(this.text, xOffset * SCALE, yOffset * SCALE);
    this.renderedTexture = ctx.getImageData(0, 0, this._width * SCALE, this._height * SCALE).data;
  }

  get width() {
    return this._width ?? 0;
  }

  get height() {
    return this._height ?? 0;
  }

  get image() {
    if (this.renderedTexture === null) {
      throw new Error('Tried to load BLP texture before it was loaded');
    }
    return this.renderedTexture;
  }

  get isLoaded() {
    return this.renderedTexture !== null;
  }
}

export default FontTexture;
