class Color {
  value: number;
  r: number;
  g: number;
  b: number;
  a: number;


  constructor(value = 0x00000000) {
    this.value = value;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 255;
  }

  /*get r(): number {
    const val = (this.value & 0xFF000000) >> 24;
    return val < 0 ? val * -1 : val;
  }

  set r(val: number) {
    this.value = ((val & 0xFF) << 24) | (this.value & 0x00FFFFFF);
  }

  get g(): number {
    return (this.value & 0x00FF0000) >> 16;
  }

  set g(val: number) {
    this.value = ((val & 0xFF) << 16) | (this.value & 0xFF00FFFF);
  }

  get b(): number {
    return (this.value & 0x0000FF00) >> 8;
  }

  set b(val: number) {
    this.value = ((val & 0xFF) << 8) | (this.value & 0xFFFF00FF);
  }

  get a(): number {
    return (this.value & 0x000000FF);
  }

  set a(val: number) {
    this.value = (val & 0xFF) | (this.value & 0xFFFFFF00);
  }*/
}

export default Color;
