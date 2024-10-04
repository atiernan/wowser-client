import FrameStrataType from '../abstract/FrameStrataType';
import Frame from '../simple/Frame';

class WorldFrame extends Frame {
  constructor(parent: Frame) {
    super(parent);

    //this.strataType = FrameStrataType.WORLD;
  }
}

export default WorldFrame;
