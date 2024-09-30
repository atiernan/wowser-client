import { MouseEvent, KeyBoardEvent } from '../event/Events';
import { Frame } from './components';

export enum FrameEvent {
  MOUSE,
  KEYBOARD,
}

interface MouseEventHandler extends Frame {
  onMouseMove?(event: MouseEvent): boolean;
  onMouseDown?(event: MouseEvent): boolean;
  onMouseUp?(event: MouseEvent): boolean;
}

interface KeyBoardEventHandler extends Frame {
  onKeyDown?(event: KeyBoardEvent): boolean;
  onKeyUp?(event: KeyBoardEvent): boolean;
}

export type FrameEventHandlerLUT = {
  [T in FrameEvent]: {
    [FrameEvent.MOUSE]: MouseEventHandler,
    [FrameEvent.KEYBOARD]: KeyBoardEventHandler,
  }[T]
}