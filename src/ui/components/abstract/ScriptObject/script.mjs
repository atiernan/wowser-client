import {
  LUA_REGISTRYINDEX,
  lua_pushnil,
  lua_pushstring,
  lua_rawgeti,
} from '../../../scripting/lua';

import ScriptObject from '.';

export const GetObjectType = () => {
  return 0;
};

export const IsObjectType = () => {
  return 0;
};

export const GetName = (L) => {
  const object = ScriptObject.getObjectFromStack(L);
  if (object && object.name) {
    lua_pushstring(L, object.name);
  } else {
    lua_pushnil(L);
  }

  return 1;
};

export const GetParent = (L) => {
  const object = ScriptObject.getObjectFromStack(L);

  const { parent } = object;
  if (parent) {
    if (!parent.isLuaRegistered) {
      parent.register();
    }
    lua_rawgeti(L, LUA_REGISTRYINDEX, parent.luaRef);
  } else {
    lua_pushnil(L);
  }

  return 1;
};
