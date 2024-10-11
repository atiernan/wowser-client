import {
  lua_State,
  lua_isstring,
  lua_type,
  lua_typename,
  luaL_error,
  lua_tojsstring,
  lua_isnil,
} from '../../scripting/lua';

import FontString from './FontString';

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

export const SetVertexColor = () => {
  return 0;
};

export const GetAlpha = () => {
  return 0;
};

export const SetAlpha = () => {
  return 0;
};

export const SetAlphaGradient = () => {
  return 0;
};

export const Show = () => {
  return 0;
};

export const Hide = () => {
  return 0;
};

export const IsVisible = () => {
  return 0;
};

export const IsShown = () => {
  return 0;
};

export const GetFontObject = () => {
  return 0;
};

export const SetFontObject = () => {
  return 0;
};

export const GetFont = () => {
  return 0;
};

export const SetFont = () => {
  return 0;
};

export const GetText = () => {
  return 0;
};

export const GetFieldSize = () => {
  return 0;
};

export const SetText = (L: lua_State) => {
  const fontString = <FontString>FontString.getObjectFromStack(L);
  
  let text = '';
  if (lua_isnil(L, 1)) {
    text = '';
  } else if (lua_isstring(L, 1)) {
    text = lua_tojsstring(L, 1);
  } else if (lua_isstring(L , 2)) {
    text = lua_tojsstring(L, 2);
  } else {
    try {
      //fontString.setText(lua_tojsstring(L, 1));
    } catch (_e) {
      const type = lua_typename(L, lua_type(L, 1));
      return luaL_error(L, 'Unexpected %s, expected string in %s:SetText(text)', type, fontString.displayName);
    }
  }
  fontString.setText(text);

  return 0;
};

export const SetFormattedText = (L: lua_State) => {
  const fontString = FontString.getObjectFromStack(L);
  fontString.setText('Version 3.3.4 (1234)');
  return 0;
};

export const GetTextColor = () => {
  return 0;
};

export const SetTextColor = () => {
  return 0;
};

export const GetShadowColor = () => {
  return 0;
};

export const SetShadowColor = () => {
  return 0;
};

export const GetShadowOffset = () => {
  return 0;
};

export const SetShadowOffset = () => {
  return 0;
};

export const GetSpacing = () => {
  return 0;
};

export const SetSpacing = () => {
  return 0;
};

export const SetTextHeight = () => {
  return 0;
};

export const GetStringWidth = () => {
  return 0;
};

export const GetStringHeight = () => {
  return 0;
};

export const GetJustifyH = () => {
  return 0;
};

export const SetJustifyH = () => {
  return 0;
};

export const GetJustifyV = () => {
  return 0;
};

export const SetJustifyV = () => {
  return 0;
};

export const CanNonSpaceWrap = () => {
  return 0;
};

export const SetNonSpaceWrap = () => {
  return 0;
};

export const CanWordWrap = () => {
  return 0;
};

export const SetWordWrap = () => {
  return 0;
};

export const GetIndentedWordWrap = () => {
  return 0;
};

export const SetIndentedWordWrap = () => {
  return 0;
};
