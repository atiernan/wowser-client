import Frame from './Frame';
import Script from '../../scripting/Script';

import * as scriptFunctions from './EditBox.script';
import FontString from './FontString';
import XMLNode from '../../XMLNode';
import { maxAspectCompensation, Status } from '../../../utils';
import UIContext from '../../UIContext';
import FramePointType from '../abstract/FramePointType';
import { FrameEvent } from '../../FrameEvent';
import { KeyBoardEvent } from '../../../event/Events';
import { FontHorizontalAlignment } from './Font';
class EditBox extends Frame {
  value: string;
  fontString: FontString | null;
  isPassword: boolean;
  caretPosition: number;
  readonly passwordCharacter = '⦁';

  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  constructor(parent: Frame | null) {
    super(parent);

    this.value = '';
    this.fontString = null;
    this.isPassword = false;
    this.caretPosition = 0;

    this.enableEvent(FrameEvent.MOUSE);
    this.scripts.register(
      new Script('OnEnterPressed'),
      new Script('OnEscapePressed'),
      new Script('OnSpacePressed'),
      new Script('OnTabPressed'),
      new Script('OnTextChanged', ['userInput']),
      new Script('OnTextSet'),
      new Script('OnCursorChanged', ['x', 'y', 'w', 'h']),
      new Script('OnInputLanguageChanged', ['language']),
      new Script('OnEditFocusGained'),
      new Script('OnEditFocusLost'),
      new Script('OnCharComposition', ['text']),
    );
  }

  postLoadXML(node: XMLNode, status: Status) {
    super.postLoadXML(node, status);

    const ui = UIContext.instance;

    this.isPassword = node.attributes.get('password') === '1';
    
    for (const child of node.children) {
      switch (child.name.toLowerCase()) {
        case 'fontstring':
          this.fontString = ui.createFontString(child, this);
          this.fontString.setPoint(FramePointType.LEFT, this, FramePointType.LEFT, 12 / maxAspectCompensation);
          this.fontString.font.horizontalAlignment = FontHorizontalAlignment.LEFT;
          this.fontString.show();
          break;
      }
    }
    this.setValue('a');
  }

  hasFocus() {
    return UIContext.instance.currentFocus === this;
  }

  onKeyDown({ key }: KeyBoardEvent) {
    switch (key) {
      case 'Alt':
      case 'AltGraph':
      case 'AltGr':
      case 'CapsLock':
      case 'Control':
      case 'Fn':
      case 'FnLock':
      case 'Hyper':
      case 'Meta':
      case 'Enter':
      case 'Shift':
        break;
      case 'Backspace':
        this.setValue(this.value.slice(0, -1));
        break;
      default: 
        this.setValue(this.value + key);
    }
  }

  setValue(value: string) {
    this.value = value;
    this.fontString?.setTextRaw(this.isPassword ? this.passwordCharacter.repeat(value.length) : value);
  }

  showThis(): boolean {
    const result = super.showThis();
    this.fontString?.show();
    return result;
  }
}

export default EditBox;
