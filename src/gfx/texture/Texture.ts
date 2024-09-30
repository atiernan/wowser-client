interface Texture {
  readonly image: HTMLImageElement | Uint8Array | Uint8ClampedArray;
  readonly width: number;
  readonly height: number;
  readonly isLoaded: boolean;
}

export default Texture;
