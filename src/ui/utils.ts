import Color from '../gfx/Color';
import { BlendMode } from '../gfx/types';

import DrawLayerType from './DrawLayerType';
import XMLNode from './XMLNode';
import FramePointType from './components/abstract/FramePointType';
import FrameStrataType from './components/abstract/FrameStrataType';

export const stringToBlendMode = (string?: string) => {
  if (!string) return undefined;
  return BlendMode[string?.toUpperCase() as keyof typeof BlendMode];
};

export const stringToDrawLayerType = (string?: string) => {
  if (!string) return undefined;
  return DrawLayerType[string?.toUpperCase() as keyof typeof DrawLayerType];
};

export const stringToFramePointType = (string?: string) => {
  if (!string) return undefined;
  return FramePointType[string.toUpperCase() as keyof typeof FramePointType];
};

export const stringToFrameStrataType = (string?: string) => {
  if (!string) return undefined;
  return FrameStrataType[string?.toUpperCase() as keyof typeof FrameStrataType];
};

export const colorFromNode = (node: XMLNode) => {
  const result = new Color(0x00000000);
  if (node.attributes.has('r')) {
    result.r = Number(node.attributes.get('r')) * 255;
  }
  if (node.attributes.has('g')) {
    result.g = Number(node.attributes.get('g')) * 255;
  }
  if (node.attributes.has('b')) {
    result.b = Number(node.attributes.get('b')) * 255;
  }
  if (node.attributes.has('a')) {
    result.a = Number(node.attributes.get('a')) * 255;
  }
  return result;
};
