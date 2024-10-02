interface Texture {
  readonly image: HTMLImageElement | Uint8Array | Uint8ClampedArray | ArrayBuffer;
  readonly width: number;
  readonly height: number;
  readonly isLoaded: boolean;
}

export default Texture;
