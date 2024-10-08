import { lua_State, lua_pushnumber } from '../../scripting/lua';

import Slider from './Slider';

export const GetThumbTexture = () => {
  return 0;
};

export const SetThumbTexture = () => {
  return 0;
};

export const GetOrientation = () => {
  return 0;
};

export const SetOrientation = () => {
  return 0;
};

export const GetMinMaxValues = (L: lua_State) => {
  lua_pushnumber(L, 1);
  lua_pushnumber(L, 100);
  return 2;
};

export const SetMinMaxValues = () => {
  return 0;
};

export const GetValue = (L: lua_State) => {
  const slider = Slider.getObjectFromStack(L);
  const { value } = slider;
  lua_pushnumber(L, value);
  return 1;
};

export const SetValue = () => {
  return 0;
};

export const GetValueStep = () => {
  return 0;
};

export const SetValueStep = () => {
  return 0;
};

export const Enable = () => {
  return 0;
};

export const Disable = () => {
  return 0;
};

export const IsEnabled = () => {
  return 0;
};

