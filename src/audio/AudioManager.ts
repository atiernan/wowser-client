import DBC from '../resources/DBC';
import { VirtualFileSystem } from '../resources/fs/VirtualFileSystem';
import { AudioDriver, AudioType } from './AudioDriver';
import SoundEntry from './SoundEntry';

class AudioManager {
  #entries: null | DBC<SoundEntry>;
  #nameMap: Record<string, SoundEntry>;
  #driver: AudioDriver;
  #fs: VirtualFileSystem;

  constructor(fs: VirtualFileSystem) {
    this.#entries = null;
    this.#nameMap = {};
    this.#driver = new AudioDriver();
    this.#fs = fs;

    fs.fetch('DBFilesClient/SoundEntries.dbc').then((data) => {
      this.#entries = DBC.loadFromArray(SoundEntry, data);
      this.#entries.records.forEach((entry) => {
        this.#nameMap[entry.name] = entry;
      });
    });
  }

  playByName(name: string, type: AudioType) {
    if (this.#entries === null) {
      throw new Error('Attempted to play sound before sounds are loaded');
    }

    const sound = this.#nameMap[name];
    if (sound) {
      this.#fs.fetch(sound.randomPath).then((data) => {
        this.#driver.playAudio(data, sound.volume, false, type);
      });
    }
  }
}

export default AudioManager;