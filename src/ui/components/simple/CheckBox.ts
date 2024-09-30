import Button from './Button';

import * as scriptFunctions from './CheckBox.script';
import Frame from './Frame';

class CheckBox extends Button {
  checked: boolean;

  constructor(parent: Frame | null) {
    super(parent);

    this.checked = false;
  }

  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }
}

export default CheckBox;
