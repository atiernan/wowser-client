import Client from '../../../Client';
import Font from '../../../gfx/Font';
import { extractValueFrom } from '../../../utils';
import UIContext from '../../UIContext';
import XMLNode from '../../XMLNode';

const DEFAULT_FONT_HEIGHT = 15;

class Fontable {
  size: number;
  font?: Font;

  constructor() {
    this.size = DEFAULT_FONT_HEIGHT;
  }

  loadFontXML(node: XMLNode) {
    const name = node.attributes.get('name');
    const inherits = node.attributes.get('inherits');
    const font = node.attributes.get('font');
    const spacing = node.attributes.get('spacing');

    this.size = Number(node.attributes.get('height') ?? DEFAULT_FONT_HEIGHT);

    if (inherits) {
      const template = UIContext.instance.templates.get(inherits);
      if (template && !template.locked) {
        template.lock();
        this.loadFontXML(template.node);
        template.release();
      }
    }

    for (const child of node.children) {
      switch (child.name.toLowerCase()) {
        case 'fontheight':
          this.size = extractValueFrom(child, false) ?? this.size;
          break;
      }
    }

    if (font) {
      this.setFont(font);
    }
  }

  setFont(filename: string) {
    if (filename) {
      this.font = Client.instance.fonts.lookup(filename);
    }
    return true;
  }
}

export default Fontable;