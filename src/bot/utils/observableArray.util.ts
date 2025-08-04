import { EventEmitter } from 'events';

class ObservableArray<T> extends EventEmitter {
  private items: T[] = [];

  push(item: T) {
    this.items.push(item);
    this.emit('push', item, this.items.length - 1);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }

  findByString(value: string): T | undefined {
    return this.items.find(s => s === value);
  }

  deleteByString(value: string) {
    this.items.splice(this.items.findIndex(s => s === value), 1);
  }
}

export default ObservableArray;