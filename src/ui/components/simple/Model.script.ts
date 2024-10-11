import { lua_isstring, lua_State, lua_tojsstring, lua_type, lua_typename, luaL_error } from '../../scripting/lua';
import Model from './Model';

export const SetModel = (L: lua_State): number => {
  const model = Model.getObjectFromStack(L);

  if (!lua_isstring(L, 2)) {
    const type = lua_typename(L, lua_type(L, 2));
    return luaL_error(L, 'Unexpected %s, expected string in %s:SetModel(text)', type, model.displayName);
  }

  const modelPath = lua_tojsstring(L, 2);
  console.log(`Changing model to ${modelPath}`);
  model.setModel(modelPath);
  return 0;
};

export const OnUpdateModel = () => {
  return 0;
};

export const GetModel = () => {
  return 0;
};

export const ClearModel = () => {
  return 0;
};

export const SetPosition = () => {
  return 0;
};

export const SetFacing = () => {
  return 0;
};

export const SetModelScale = () => {
  return 0;
};

export const SetSequence = () => {
  return 0;
};

export const SetSequenceTime = () => {
  return 0;
};

export const SetCamera = () => {
  return 0;
};

export const SetLight = () => {
  return 0;
};

export const GetLight = () => {
  return 0;
};

export const GetPosition = () => {
  return 0;
};

export const GetFacing = () => {
  return 0;
};

export const GetModelScale = () => {
  return 0;
};

export const AdvanceTime = () => {
  return 0;
};

export const ReplaceIconTexture = () => {
  return 0;
};

export const SetFogColor = () => {
  return 0;
};

export const GetFogColor = () => {
  return 0;
};

export const SetFogNear = () => {
  return 0;
};

export const GetFogNear = () => {
  return 0;
};

export const SetFogFar = () => {
  return 0;
};

export const GetFogFar = () => {
  return 0;
};

export const ClearFog = () => {
  return 0;
};

export const SetGlow = () => {
  return 0;
};

export const ResetLights = () => {
  return 0;
};
