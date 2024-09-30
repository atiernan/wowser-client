import { lua_State, lua_pushboolean } from '../../scripting/lua';

export const GetCurrentResolution = () => {
  return 0;
};

export const GetScreenResolutions = () => {
  return 0;
};

export const GetRefreshRates = () => {
  return 0;
};

export const GetCurrentMultisampleFormat = () => {
  return 0;
};

export const GetMultisampleFormats = () => {
  return 0;
};

export const IsStereoVideoAvailable = (L: lua_State) => {
  lua_pushboolean(L, false);
  return 1;
};
