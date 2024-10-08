import EventType from './EventType';
import ScriptingContext, { ScriptFunction } from './ScriptingContext';
import Script from './Script';
import ScriptRegistry from './ScriptRegistry';
import {
  LUA_REGISTRYINDEX,
  LUA_TTABLE,
  lua_Ref,
  lua_State,
  lua_createtable,
  lua_getglobal,
  lua_pushcclosure,
  lua_pushlightuserdata,
  lua_pushnumber,
  lua_pushstring,
  lua_rawgeti,
  lua_rawset,
  lua_setglobal,
  lua_setmetatable,
  lua_settable,
  lua_settop,
  lua_touserdata,
  lua_type,
  luaL_error,
  luaL_ref,
  lua_pushboolean,
  lua_pushnil,
} from './lua';
import { This, ThisConstructor } from '../../utils';

const scriptMetaTables = new Map<typeof FrameScriptObject, lua_Ref>();
const objectTypes = new Map<typeof FrameScriptObject, number>();

class FrameScriptObject {
  luaRef: lua_Ref | null;
  scripts: ScriptRegistry;

  constructor(..._args: unknown[]) {
    this.luaRef = null;

    this.scripts = new ScriptRegistry();
    this.scripts.register(
      new Script('OnEvent', ['event', '...']),
    );
  }

  get displayName() {
    return this.name || '<unnamed>';
  }

  get isLuaRegistered() {
    return this.luaRef !== null;
  }

  get name(): string | null {
    return null;
  }

  register(name: string | null = null) {
    const L = ScriptingContext.instance.state;

    if (!this.isLuaRegistered) {
      // TODO: Tainted code handling

      lua_createtable(L, 0, 0);
      lua_pushnumber(L, 0.0);
      lua_pushlightuserdata(L, this);
      lua_rawset(L, -3);

      const ref = (this.constructor as typeof FrameScriptObject).scriptMetaTable;
      lua_rawgeti(L, LUA_REGISTRYINDEX, ref);
      lua_setmetatable(L, -2);

      this.luaRef = luaL_ref(L, LUA_REGISTRYINDEX);
    }

    if (name) {
      lua_getglobal(L, name);

      const found = lua_type(L, -1);
      lua_settop(L, -2);

      if (!found) {
        lua_rawgeti(L, LUA_REGISTRYINDEX, this.luaRef!);
        lua_setglobal(L, name);
      }
    }
  }

  unregister(_name: string | null = null) {
    // TODO: Implementation
  }

  registerScriptEvent(type: EventType) {
    const scripting = ScriptingContext.instance;

    const event = scripting.events[type];
    if (!event) {
      return false;
    }

    if (event.pendingSignalCount) {
      const node = event.unregisterListeners.find((node) => node.listener === this);
      if (node) {
        event.unregisterListeners.unlink(node);
      }
    }

    const node = event.listeners.find((node) => node.listener === this);
    if (!node) {
      scripting.registerScriptEvent(this, event);
    }

    return true;
  }

  runScript(name: string, args: { type: string; value: any }[] = []) {
    // TODO: This needs to be moved to the caller
    const script = this.scripts.get(name);
    if (script && script.luaRef) {
      for (const { type, value } of args) {
        switch (type) {
          case 'string': {
            lua_pushstring(ScriptingContext.instance.state, value);
            break;
          }
          case 'number': {
            lua_pushnumber(ScriptingContext.instance.state, value);
            break;
          }
          case 'nil': {
            lua_pushnil(ScriptingContext.instance.state);
            break;
          }
          case 'boolean': {
            lua_pushboolean(ScriptingContext.instance.state, value);
            break;
          }
        }
      }
      ScriptingContext.instance.executeFunction(script.luaRef, this, args.length);
    }
  }

  static getObjectByName<T extends ThisConstructor<typeof FrameScriptObject>>(
    this: T,
    name: string,
    type = this
  ): This<T> | null {
    const object = ScriptingContext.instance.getObjectByName(name);
    if (object && object instanceof type) {
      return object;
    }
    return null;
  }

  // Note: Throw (as `luaL_error` throws) otherwise TypeScript infers incorrect return type
  static getObjectFromStack<T extends ThisConstructor<typeof FrameScriptObject>>(
    this: T,
    L: lua_State
  ): This<T> {
    if (lua_type(L, 1) !== LUA_TTABLE) {
      throw luaL_error(L, "Attempt to find 'this' in non-table object (used '.' instead of ':' ?)");
    }

    lua_rawgeti(L, 1, 0);
    const object = lua_touserdata(L, -1);
    lua_settop(L, -2);

    if (!object) {
      throw luaL_error(L, "Attempt to find 'this' in non-framescript object");
    }

    // TODO: Will this work in all scenarios?
    if (!(object instanceof this)) {
      throw luaL_error(L, 'Wrong object type for member function');
    }

    return object;
  }

  static get scriptFunctions(): Record<string, ScriptFunction> {
    return {};
  }

  static get scriptMetaTable() {
    let scriptMetaTable = scriptMetaTables.get(this);
    if (!scriptMetaTable) {
      const L = ScriptingContext.instance.state;

      lua_createtable(L, 0, 0);
      lua_pushstring(L, '__index');
      lua_createtable(L, 0, 0);

      for (const [name, func] of Object.entries(this.scriptFunctions)) {
        lua_pushstring(L, name);
        lua_pushcclosure(L, func, 0);
        lua_settable(L, -3);
      }

      lua_settable(L, -3);

      scriptMetaTable = luaL_ref(L, LUA_REGISTRYINDEX);
      scriptMetaTables.set(this, scriptMetaTable);
    }
    return scriptMetaTable;
  }

  static get objectType() {
    let type = objectTypes.get(this);
    if (!type) {
      type = objectTypes.size;
      objectTypes.set(this, type);
    }
    return type;
  }
}

export default FrameScriptObject;
