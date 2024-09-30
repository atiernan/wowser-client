import DBC from '../common/DBC';
import { fetch } from '../utils';
import { AudioDriver } from './Driver';
import SoundEntry from './SoundEntry';

class SoundManager {
  entries: null | DBC<SoundEntry>;
  nameMap: Record<string, SoundEntry>;
  driver: AudioDriver;

  constructor() {
    this.entries = null;
    this.nameMap = {};
    this.driver = new AudioDriver();

    DBC.loadFile('DBFilesClient/SoundEntries.dbc', SoundEntry).then((dbc) => {
      this.entries = dbc;
      this.entries.records.forEach((entry) => {
        this.nameMap[entry.name] = entry;
      });
    });
  }

  getByName(name: string): SoundEntry | null {
    if (this.entries === null) {
      throw new Error('Attempted to get sound before sounds are loaded');
    }

    if (this.nameMap[name]) {
      return this.nameMap[name];
    }

    return null;
  }

  playByName(name: string) {
    const sound = this.getByName(name);
    if (sound) {
      fetch(sound.randomPath, 'arrayBuffer').then((data) => {
        this.driver.playAudio(data, 100, false, 1);
      });
    }
  }
}

export default SoundManager;