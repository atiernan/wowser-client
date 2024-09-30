import Script from '../../scripting/Script';
import Frame from './Frame';

import * as scriptFunctions from './HTML.script';

class HTML extends Frame {

  constructor(parent: Frame | null) {
    super(parent);

    this.scripts.register(
      new Script('OnHyperlinkClick', ['self', 'link', 'text', 'button', 'region', 'left', 'bottom', 'width', 'height']),
    );
  }

  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }
}

export default HTML;
