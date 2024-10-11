import { ClientDb, ClientDbRecord } from '@wowserhq/format';
import { VirtualFileSystem } from '../resources/fs/VirtualFileSystem';

interface Constructor<T> {
  new (...args: any[]): T;
}

type DBCManagerOptions = {
  fs: VirtualFileSystem;
};

class DBCManager {
  #fs: VirtualFileSystem;
  #loaded = new Map<string, ClientDb<any>>();
  #loading = new Map<string, Promise<ClientDb<any>>>();

  constructor(options: DBCManagerOptions) {
    this.#fs = options.fs;
  }

  get<T extends ClientDbRecord>(name: string, RecordClass: Constructor<T>): Promise<ClientDb<T>> {
    const normalizedPath = name.trim().toLowerCase().replaceAll(/\\/g, '/');
    const refId = [normalizedPath, RecordClass.prototype.constructor.name].join(':');

    const loaded = this.#loaded.get(refId);
    if (loaded) {
      return Promise.resolve(loaded);
    }

    const alreadyLoading = this.#loading.get(refId);
    if (alreadyLoading) {
      return alreadyLoading;
    }

    const loading = this.#load(refId, name, RecordClass);
    this.#loading.set(refId, loading);

    return loading;
  }

  async #load<T extends ClientDbRecord>(
    refId: string,
    name: string,
    RecordClass: Constructor<T>,
  ): Promise<ClientDb<T>> {
    const path = `DBFilesClient/${name}`;

    let db: ClientDb<T>;
    try {
      const data = await this.#fs.fetch(path);
      db = new ClientDb(RecordClass).load(data);

      this.#loaded.set(refId, db);
    } finally {
      this.#loading.delete(refId);
    }

    return db;
  }
}

export default DBCManager;
export { DBCManager };
