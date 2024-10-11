import { lua_pushboolean, lua_State, lua_toboolean } from '../../scripting/lua';
import CheckBox from './CheckBox';

export const SetChecked = (L: lua_State) => {
  const checkBox = CheckBox.getObjectFromStack(L);
  checkBox.checked = lua_toboolean(L, 1);
  return 0;
};

export const GetChecked = (L: lua_State) => {
  const checkBox = CheckBox.getObjectFromStack(L);
  lua_pushboolean(L, checkBox.checked);
  return 1;
};

export const GetCheckedTexture = () => {
  return 0;
};

export const SetCheckedTexture = () => {
  return 0;
};

export const GetDisabledCheckedTexture = () => {
  return 0;
};

export const SetDisabledCheckedTexture = () => {
  return 0;
};
