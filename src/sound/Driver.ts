export enum AudioType {
  Ambience,
  Effects,
  Music,
  Dialog,
}

export class AudioDriver {
  private context: AudioContext;
  private masterVolume: GainNode;
  private ambienceVolume: GainNode;
  private effectsVolume: GainNode;
  private musicVolume: GainNode;
  private dialogVolume: GainNode;

  constructor() {
    this.context = new AudioContext();
    this.masterVolume = this.context.createGain();
    this.masterVolume.gain.setValueAtTime(0.8, this.context.currentTime);
    this.masterVolume.connect(this.context.destination);

    this.ambienceVolume = this.context.createGain();
    this.ambienceVolume.gain.setValueAtTime(0.8, this.context.currentTime);
    this.ambienceVolume.connect(this.masterVolume);

    this.effectsVolume = this.context.createGain();
    this.effectsVolume.gain.setValueAtTime(0.8, this.context.currentTime);
    this.effectsVolume.connect(this.masterVolume);

    this.musicVolume = this.context.createGain();
    this.musicVolume.gain.setValueAtTime(0.8, this.context.currentTime);
    this.musicVolume.connect(this.masterVolume);

    this.dialogVolume = this.context.createGain();
    this.dialogVolume.gain.setValueAtTime(0.8, this.context.currentTime);
    this.dialogVolume.connect(this.masterVolume);
  }

  public playAudio(data: Uint8Array, volume: number, loop: boolean, type: AudioType): Promise<void> {
    return new Promise((resolve) => {
      this.context.decodeAudioData(data.slice(0)).then((buffer) => {
        const src = this.context.createBufferSource();
        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(volume / 100, this.context.currentTime);

        let typeVolume = null;
        switch (type) {
          case AudioType.Ambience:
            typeVolume = this.ambienceVolume;
            break;
          case AudioType.Dialog:
            typeVolume = this.dialogVolume;
            break;
          case AudioType.Effects:
            typeVolume = this.effectsVolume;
            break;
          case AudioType.Music:
            typeVolume = this.musicVolume;
            break;
        }

        gainNode.connect(typeVolume);
        src.buffer = buffer;
        src.connect(gainNode);
        src.start(0);
        src.loop = loop;
        this.context.decodeAudioData(data);
        src.onended = () => {
          gainNode.disconnect();
          src.disconnect();
          resolve();
        };
      });
    });
  }
}