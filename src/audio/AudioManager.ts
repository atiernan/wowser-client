import { DBCManager } from '../db/DBCManager';
import { VirtualFileSystem } from '../resources/fs/VirtualFileSystem';
import { AudioDriver, AudioType, PlayingAudio } from './AudioDriver';
import { ClientDb, SoundEntriesRecord } from '@wowserhq/format';

class AudioManager {
  #dbc: ClientDb<SoundEntriesRecord>;
  #nameMap: Record<string, SoundEntriesRecord>;
  #driver: AudioDriver;
  #fs: VirtualFileSystem;

  constructor(fs: VirtualFileSystem, dbcManager: DBCManager) {
    this.#dbc = new ClientDb(SoundEntriesRecord);
    this.#nameMap = {};
    this.#driver = new AudioDriver();
    this.#fs = fs;

    dbcManager.get('SoundEntries.dbc', SoundEntriesRecord).then((_dbc) => {
      this.#dbc = _dbc;
      this.#dbc.records.forEach((entry: SoundEntriesRecord) => {
        this.#nameMap[entry.name] = entry;
      });
    });
  }

  async playByName(name: string, type: AudioType): Promise<null | PlayingAudio> {
    if (this.#dbc === null) {
      throw new Error('Attempted to play sound before sounds are loaded');
    }

    const sound = this.#nameMap[name];
    if (sound) {
        const data = await this.#fs.fetch(sound.randomPath());
        console.debug(`Playing audio "${name}"`);
        return this.#driver.playAudio(data, sound.volumeFloat, false, type);
    }
    return null;
  }

  stop(audioId: number) {
    this.#driver.stopAudio(audioId);
  }
}

export default AudioManager;