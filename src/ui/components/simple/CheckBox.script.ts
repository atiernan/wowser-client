import { lua_isnumber, lua_State, lua_toboolean, lua_tonumber } from '../../scripting/lua';
import CheckBox from './CheckBox';

export const SetChecked = (L: lua_State) => {
  const checkBox = CheckBox.getObjectFromStack(L);
  checkBox.checked = lua_toboolean(L, 1);
  return 0;
};

export const GetChecked = () => {
  return 0;
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
