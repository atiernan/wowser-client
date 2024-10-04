import { DataReader } from '../utils/DataReader';

enum SoundType {
  Spells = 1,
  UI = 2,
  Footsteps = 3,
  CombatImpacts = 4,
  CombatSwings = 6,
  Greetings = 7,
  Casting = 8,
  PickUpPutDown = 9,
  NPCCombat = 10,
  Errors = 12,
  Birds = 13,
  Doodad = 14,
  DeathThud = 16,
  NPC = 17,
  Test = 18,
  Foley = 19,
  FootstepSplashes = 20,
  CharacterSplash = 21,
  WaterVolume = 22,
  Tradeskill = 23,
  TerrainEmitter = 24,
  GameObject = 25,
  SpellFizzes = 26,
  CreatureLoops = 27,
  ZoneMusic = 28,
  CharacterMacroLines = 29,
  CinematicMusic = 30,
  CinematicVoice = 31,
  ZoneAmbience = 50,
  SoundEmitters = 52,
  VehicleStates = 53,
}

enum SoundFlags {
  UseOSSettings         = 0x20,
  PlaySpellLooped       = 0x200,
  SetFrequencyAndVolume = 0x400,
}

class SoundEntry {
  id: number = 0;
  type: SoundType = SoundType.UI;
  nameId: number = 0;
  fileIds: number[] = [];
  frequencies: number[] = [];
  directoryBaseId: number = 0;
  volume: number = 0;
  flags: SoundFlags[] = [];
  minDistance: number = 0;
  eaxDef: number = 0;
  distanceCutoff: number = 0;
  advancedId: number = 0;
  private strings: string[] = [];
  
  static fromReader(reader: DataReader, strings: string[]): SoundEntry {
    const result = new SoundEntry;
    result.strings = strings;
    result.id = reader.readUint32();
    result.type = reader.readUint32();
    result.nameId = reader.readUint32();
    for (let i = 0; i < 10; i++) {
      result.fileIds.push(reader.readUint32());
    }
    for (let i = 0; i < 10; i++) {
      result.frequencies.push(reader.readUint32());
    }
    result.directoryBaseId = reader.readUint32();
    result.volume = reader.readFloat();
    result.flags = []; reader.readUint32();
    result.minDistance = reader.readFloat();
    result.distanceCutoff = reader.readFloat();
    result.eaxDef = reader.readUint32();
    result.advancedId = reader.readUint32();

    return result;
  }

  get name() {
    return this.strings[this.nameId];
  }

  get files() {
    return this.fileIds.filter((id) => id > 0).map((id) => this.strings[id]);
  }

  get directoryBase() {
    return this.strings[this.directoryBaseId];
  }

  get randomPath() {
    const files = this.files;
    return this.directoryBase + '\\' + files[Math.floor(Math.random() * files.length)];
  }
}

export default SoundEntry;
