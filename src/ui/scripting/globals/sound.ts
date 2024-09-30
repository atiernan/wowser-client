import Client from '../../../Client';
import { luaL_error, lua_State, lua_isstring, lua_pushnumber, lua_tojsstring } from '../../scripting/lua';

export const PlaySound = (L: lua_State) => {
  if (!lua_isstring(L, 1)) {
    luaL_error(L, 'Usage: PlaySound("sound")');
    console.error('Usage: PlaySound("sound")');
    return 0;
  }

  const soundName = lua_tojsstring(L, 1);
  Client.instance.sound.playByName(soundName);
  return 0;
};

export const PlayMusic = (L: lua_State) => {
  if (!lua_isstring(L, 1)) {
    luaL_error(L, 'Usage: PlayMusic("Path\\To\\File")');
    return 0;
  }

  const sound = lua_tojsstring(L, 1);
  console.error(`Playing ${sound}`);
  return 0;
};

export const PlaySoundFile = (L: lua_State) => {
  if (!lua_isstring(L, 1)) {
    luaL_error(L, 'Usage: PlaySoundFile("Path\\To\\File")');
    return 0;
  }

  const sound = lua_tojsstring(L, 1);
  console.error(`Playing ${sound}`);
  return 0;
};

export const StopMusic = () => {
  return 0;
};

export const Sound_GameSystem_GetNumInputDrivers = () => {
  return 0;
};

export const Sound_GameSystem_GetInputDriverNameByIndex = () => {
  return 0;
};

export const Sound_GameSystem_GetNumOutputDrivers = (L: lua_State) => {
  lua_pushnumber(L, 0);
  return 1;
};

export const Sound_GameSystem_GetOutputDriverNameByIndex = () => {
  return 0;
};

export const Sound_GameSystem_RestartSoundSystem = () => {
  return 0;
};

export const Sound_ChatSystem_GetNumInputDrivers = () => {
  return 0;
};

export const Sound_ChatSystem_GetInputDriverNameByIndex = () => {
  return 0;
};

export const Sound_ChatSystem_GetNumOutputDrivers = () => {
  return 0;
};

export const Sound_ChatSystem_GetOutputDriverNameByIndex = () => {
  return 0;
};

export const VoiceChat_StartCapture = () => {
  return 0;
};

export const VoiceChat_StopCapture = () => {
  return 0;
};

export const VoiceChat_RecordLoopbackSound = () => {
  return 0;
};

export const VoiceChat_StopRecordingLoopbackSound = () => {
  return 0;
};

export const VoiceChat_PlayLoopbackSound = () => {
  return 0;
};

export const VoiceChat_StopPlayingLoopbackSound = () => {
  return 0;
};

export const VoiceChat_IsRecordingLoopbackSound = () => {
  return 0;
};

export const VoiceChat_IsPlayingLoopbackSound = () => {
  return 0;
};

export const VoiceChat_GetCurrentMicrophoneSignalLevel = () => {
  return 0;
};

export const VoiceChat_ActivatePrimaryCaptureCallback = () => {
  return 0;
};
