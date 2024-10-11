import { Vector2 } from '@wowserhq/math';
import { lua_gettop, lua_State, lua_tonumber, luaL_error } from '../../scripting/lua';

import Texture from './Texture';

export const IsObjectType = () => {
  return 0;
};

export const GetObjectType = () => {
  return 0;
};

export const GetDrawLayer = () => {
  return 0;
};

export const SetDrawLayer = () => {
  return 0;
};

export const GetBlendMode = () => {
  return 0;
};

export const SetBlendMode = () => {
  return 0;
};

export const GetVertexColor = () => {
  return 0;
};

export const SetVertexColor = () => {
  return 0;
};

export const SetGradient = () => {
  return 0;
};

export const SetGradientAlpha = () => {
  return 0;
};

export const SetAlpha = () => {
  return 0;
};

export const GetAlpha = () => {
  return 0;
};

export const Show = (L: lua_State): number => {
  const texture = Texture.getObjectFromStack(L);
  texture.show();
  return 0;
};

export const Hide = (L: lua_State): number => {
  const texture = Texture.getObjectFromStack(L);
  texture.hide();
  return 0;
};

export const IsVisible = () => {
  return 0;
};

export const IsShown = () => {
  return 0;
};

export const GetTexture = () => {
  return 0;
};

export const SetTexture = () => {
  return 0;
};

export const GetTexCoord = () => {
  return 0;
};

export const SetTexCoord = (L: lua_State) => {
  const texture = Texture.getObjectFromStack(L);

  if (lua_gettop(L) != 5) {
    return luaL_error(L, 'Usage: SetTexCoord(coord1, coord2, coord3, coord4)');
  }

  const left = lua_tonumber(L, 2);
  const right = lua_tonumber(L, 3);
  const top = lua_tonumber(L, 4);
  const bottom = lua_tonumber(L, 5);
  const coords = [
    new Vector2([left, top]),
    new Vector2([left, bottom]),
    new Vector2([right, top]),
    new Vector2([right, bottom]),
  ] as const;
  texture.setTextureCoords(coords);
  //texture.onRegionChanged();
  return 0;
};

export const SetRotation = () => {
  return 0;
};

export const SetDesaturated = () => {
  return 0;
};

export const IsDesaturated = () => {
  return 0;
};

export const SetNonBlocking = () => {
  return 0;
};

export const GetNonBlocking = () => {
  return 0;
};

export const SetHorizTile = () => {
  return 0;
};

export const GetHorizTile = () => {
  return 0;
};

export const SetVertTile = () => {
  return 0;
};

export const GetVertTile = () => {
  return 0;
};
