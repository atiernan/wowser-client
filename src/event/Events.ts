export enum EventType {
  CHAR               = 1,
  FOCUS              = 2,
  DESTROY            = 4,
  IDLE               = 6,
  POLL               = 7,
  INITIALIZE         = 8,
  KEYDOWN            = 9,
  KEYUP              = 10,
  KEYDOWN_REPEATING  = 11,
  MOUSEDOWN          = 12,
  MOUSEMOVE          = 13,
  MOUSEMOVE_RELATIVE = 14,
  MOUSEUP            = 15,
  MOUSEMODE_CHANGED  = 16,
  MOUSEWHEEL         = 17,
  PAINT              = 23,
  NET_DATA           = 24,
  NET_CONNECT        = 25,
  NET_DISCONNECT     = 26,
  NET_CANTCONNECT    = 27,
  NET_DESTROY        = 28,
  NET_AUTH_CHALLENGE = 29,
  IME                = 34,
  SIZE               = 35,
}

export type EventTypeLUT = {
  [T in EventType]: {
    [EventType.CHAR]: never,
    [EventType.FOCUS]: never,
    [EventType.DESTROY]: never,
    [EventType.IDLE]: never,
    [EventType.POLL]: never,
    [EventType.INITIALIZE]: never,
    [EventType.KEYDOWN]: KeyBoardEvent,
    [EventType.KEYUP]: KeyBoardEvent,
    [EventType.KEYDOWN_REPEATING]: KeyBoardEvent,
    [EventType.MOUSEDOWN]: MouseEvent,
    [EventType.MOUSEMODE_CHANGED]: never,
    [EventType.MOUSEMOVE]: MouseEvent,
    [EventType.MOUSEMOVE_RELATIVE]: never,
    [EventType.MOUSEUP]: MouseEvent,
    [EventType.MOUSEWHEEL]: never,
    [EventType.PAINT]: never,
    [EventType.NET_AUTH_CHALLENGE]: never,
    [EventType.NET_CANTCONNECT]: never,
    [EventType.NET_CONNECT]: never,
    [EventType.NET_DATA]: never,
    [EventType.NET_DESTROY]: never,
    [EventType.NET_DISCONNECT]: never,
    [EventType.IME]: never,
    [EventType.SIZE]: never,
  }[T]
}

export interface MouseEvent {
  x: number;
  y: number;
  button: number;
}

export interface KeyBoardEvent {
  key: string;
}
