import { enumRecordFor } from '../utils';
import { EventTypeLUT, EventType } from './Events';

type EventCallback<T extends EventType> = (payload: EventTypeLUT[T]) => void;
type OptionalType<T extends EventType> = EventTypeLUT[T] extends never ? [] : [EventTypeLUT[T]];

class EventContext {
  static instance: EventContext;

  private handlers: { [key in EventType]?: EventCallback<key>[] } = {};

  constructor() {
    EventContext.instance = this;

    this.handlers = enumRecordFor(EventType, (_type) => []);
  }

  on<T extends EventType>(type: T, callback: EventCallback<T>) {
    if (this.handlers[type] === undefined) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(callback);
  }

  processEvent<T extends EventType>(type: T, ...[payload]: OptionalType<T>) {
    this.handlers[type]?.forEach((callback) => callback(payload as EventTypeLUT[T]));
  }
}

export default EventContext;
