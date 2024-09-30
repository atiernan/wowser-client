import Client from '../../../Client';
import { extractValueFrom } from '../../../utils';
import UIContext from '../../UIContext';
import XMLNode from '../../XMLNode';
import ScriptObject from '../abstract/ScriptObject';
import { default as GFXFont } from '../../../gfx/Font';
import { colorFromNode } from '../../utils';
import Color from '../../../gfx/Color';

const DEFAULT_FONT_HEIGHT = 15;

enum FontVerticalAlignment {
  TOP,
  MIDDLE,
  BOTTOM,
}
enum FontHorizontalAlignment {
  LEFT,
  CENTER,
  RIGHT,
}

class Font extends ScriptObject {
  height: number;
  font?: GFXFont;
  color: Color;
  verticalAlignment: FontVerticalAlignment;
  horizontalAlignment: FontHorizontalAlignment;

  constructor() {
    super();
    this.height = DEFAULT_FONT_HEIGHT;
    this.verticalAlignment = FontVerticalAlignment.MIDDLE;
    this.horizontalAlignment = FontHorizontalAlignment.CENTER;
    this.color = new Color();
  }
  
  loadXML(node: XMLNode) {
    const name = node.attributes.get('name');
    const inherits = node.attributes.get('inherits');
    const font = node.attributes.get('font');
    const spacing = node.attributes.get('spacing');

    this.height = Number(node.attributes.get('height') ?? DEFAULT_FONT_HEIGHT);

    if (inherits) {
      this.loadTemplate(inherits);
    }

    for (const child of node.children) {
      switch (child.name.toLowerCase()) {
        case 'fontheight':
          this.height = extractValueFrom(child, false) ?? this.height;
          break;
        case 'color':
          this.color = colorFromNode(child);
          break;
      }
    }

    if (font) {
      this.setFont(font);
    }
  }

  loadTemplate(templateName: string) {
    const template = UIContext.instance.templates.get(templateName);
    if (template && !template.locked) {
      template.lock();
      this.loadXML(template.node);
      template.release();
    }
  }

  setFont(filename: string) {
    if (filename) {
      this.font = Client.instance.fonts.lookup(filename);
    }
    return true;
  }
}

export default Font;
export { FontHorizontalAlignment, FontVerticalAlignment };