import Client from '../../../../Client';
import { Model } from '../../../components';
import { lua_checkstack, lua_isnumber, lua_isstring, lua_pushboolean, lua_pushnumber, lua_pushstring, lua_State, lua_tojsstring, lua_tonumber, lua_type, lua_typename, luaL_error } from '../../lua';

const alliance = { name: 'Alliance', faction: 'Alliance' };
const horde = { name: 'The Horde', faction: 'Horde' };
const classes = [
  { id: 1, name: 'Warrior', fileName: 'WARRIOR' },
  { id: 2, name: 'Mage', fileName: 'MAGE' },
  { id: 3, name: 'Priest', fileName: 'PRIEST' },
  { id: 4, name: 'Paladin', fileName: 'PALADIN' },
  { id: 5, name: 'Druid', fileName: 'DRUID' },
  { id: 6, name: 'Hunter', fileName: 'HUNTER' },
  { id: 7, name: 'Rogue', fileName: 'ROGUE' },
  { id: 8, name: 'Shaman', fileName: 'SHAMAN' },
  { id: 9, name: 'Warlock', fileName: 'WARLOCK' },
  { id: 10, name: 'Death Knight', fileName: 'DEATHKNIGHT' },
];
const races = [
  { name: 'Human', enabled: 1, id: 0, faction: alliance, characterCreateModel: 'HUMAN' },
  { name: 'DWARF', enabled: 1, id: 1, faction: alliance, characterCreateModel: 'DWARF' },
  { name: 'GNOME', enabled: 1, id: 2, faction: alliance, characterCreateModel: 'DWARF' },
  { name: 'NIGHTELF', enabled: 1, id: 3, faction: alliance, characterCreateModel: 'NIGHTELF' },
  { name: 'DRAENEI', enabled: 1, id: 4, faction: alliance, characterCreateModel: 'DRAENEI' },

  { name: 'ORC', enabled: 1, id: 9, faction: horde, characterCreateModel: 'ORC' },
  { name: 'SCOURGE', enabled: 1, id: 6, faction: horde, characterCreateModel: 'SCOURGE' },
  { name: 'TAUREN', enabled: 1, id: 5, faction: horde, characterCreateModel: 'TAUREN' },
  { name: 'TROLL', enabled: 1, id: 8, faction: horde, characterCreateModel: 'ORC' },
  { name: 'BLOODELF', enabled: 1, id: 10, faction: horde, characterCreateModel: 'BLOODELF' },
];

let selectedSex = 2;
let selectedRace = 1;
let selectedClass = 1;
let characterCreateFrame: null | Model = null;

const characterModelPath = (raceName: string, gender: string) => `CHARACTER\\${raceName}\\${gender}\\${raceName}${gender}.M2`;

export const SetCharCustomizeFrame = (L: lua_State) => {
  if (!lua_isstring(L, 1)) {
    const type = lua_typename(L, lua_type(L, 1));
    return luaL_error(L, 'Unexpected %s, expected string in SetCharCustomizeFrame(text)', type);
  }
  const frameName = lua_tojsstring(L, 1);
  characterCreateFrame = <Model>Client.instance.ui.root.frames.find((f) => f.name === frameName);
  return 0;
};

export const SetCharCustomizeBackground = (L: lua_State) => {
  if (!lua_isstring(L, 1)) {
    const type = lua_typename(L, lua_type(L, 1));
    return luaL_error(L, 'Unexpected %s, expected string in SetCharCustomizeBackground(text)', type);
  }

  const modelPath = lua_tojsstring(L, 1);
  console.log(`Changing Character Customize model to ${modelPath}`);
  if (characterCreateFrame) {
    characterCreateFrame.setBackground(modelPath);
  }
  return 0;
};

export const ResetCharCustomize = () => {
  return 0;
};

export const GetNameForRace = (L: lua_State) => {
  lua_pushstring(L, races[selectedRace - 1].name);
  lua_pushstring(L, races[selectedRace - 1].name.toUpperCase());
  return 2;
};

export const GetenabledForRace = () => {
  return 0;
};

export const GetAvailableRaces = (L: lua_State) => {
  try {
    for (const race of races) {
      lua_checkstack(L, 3);
      lua_pushstring(L, race.name);
      lua_pushstring(L, race.name);
      lua_pushnumber(L, race.enabled);
    }
    return races.length * 3;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const GetAvailableClasses = (L: lua_State) => {
  for (const c of classes) {
    lua_checkstack(L, 3);

    lua_pushstring(L, c.name);
    lua_pushstring(L, c.fileName);
    lua_pushnumber(L, 1);
  }
  return classes.length * 3;
};

export const GetClassesForRace = (L: lua_State) => {
  for (const c of classes) {
    lua_checkstack(L, 3);

    lua_pushstring(L, c.name);
    lua_pushstring(L, c.fileName);
    lua_pushnumber(L, 1);
  }
  return classes.length * 3;
};

export const GetHairCustomization = (L: lua_State) => {
  lua_pushstring(L, 'NONE');
  return 1;
};

export const GetFacialHairCustomization = (L: lua_State) => {
  lua_pushstring(L, 'NONE');
  return 1;
};

export const GetSelectedRace = (L: lua_State) => {
  lua_pushnumber(L, selectedRace);
  return 1;
};

export const GetSelectedSex = (L: lua_State) => {
  lua_pushnumber(L, selectedSex);
  return 1;
};

export const GetSelectedClass = (L: lua_State) => {
  lua_pushstring(L, classes[selectedClass - 1].name);
  lua_pushstring(L, classes[selectedClass - 1].fileName);
  lua_pushnumber(L, classes[selectedClass - 1].id);
  return 3;
};

export const SetSelectedRace = (L: lua_State) => {
  if (!lua_isnumber(L, 1)) {
    luaL_error(L, 'Usage: SetSelectedRace(RaceId)');
    return 0;
  }
  selectedRace = lua_tonumber(L, 1);
  console.log(`Selected Race: ${selectedRace}`);
  return 0;
};

export const SetSelectedSex = (L: lua_State) => {
  if (!lua_isnumber(L, 1)) {
    luaL_error(L, 'Usage: SetSelectedSex(SexId)');
    return 0;
  }
  selectedSex = lua_tonumber(L, 1);
  console.log(`Selected Sex: ${selectedSex}`);
  const sex = selectedSex === 3 ? 'Female' : 'Male';
  if (characterCreateFrame){
    characterCreateFrame.setModel(characterModelPath(races[selectedRace - 1].name, sex));
  }
  return 0;
};

export const SetSelectedClass = (L: lua_State) => {
  if (!lua_isnumber(L, 1)) {
    luaL_error(L, 'Usage: SetSelectedClass(classId)');
    return 0;
  }
  selectedClass = lua_tonumber(L, 1);
  return 0;
};

export const UpdateCustomizationBackground = () => {
  return 0;
};

export const UpdateCustomizationScene = () => {
  return 0;
};

export const CycleCharCustomization = () => {
  return 0;
};

export const RandomizeCharCustomization = () => {
  return 0;
};

export const GetCharacterCreateFacing = () => {
  return 0;
};

export const SetCharacterCreateFacing = () => {
  return 0;
};

export const GetRandomName = () => {
  return 0;
};

export const CreateCharacter = () => {
  return 0;
};

export const CustomizeExistingCharacter = () => {
  return 0;
};

export const PaidChange_GetPreviousRaceIndex = () => {
  return 0;
};

export const PaidChange_GetCurrentRaceIndex = () => {
  return 0;
};

export const PaidChange_GetCurrentClassIndex = () => {
  return 0;
};

export const PaidChange_GetName = () => {
  return 0;
};

export const IsRaceClassValid = (L: lua_State) => {
  lua_pushboolean(L, true);
  return 1;
};

export const IsRaceClassRestricted = () => {
  return 0;
};

export const GetCreateBackgroundModel = (L: lua_State) => {
  lua_pushstring(L, races[selectedRace - 1].characterCreateModel);
  return 1;
};

export const GetFactionForRace = (L: lua_State) => {
  const index = lua_tonumber(L, 1) - 1;
  lua_pushstring(L, races[index].faction.name);
  lua_pushstring(L, races[index].faction.faction);
  return 2;
};
