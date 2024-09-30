import Client from '../../../../Client';
import {
  DDCtoNDCWidth,
  NDCtoDDCHeight,
  NDCtoDDCWidth,
  maxAspectCompensation,
  fetch,
} from '../../../../utils';
import {
  luaL_error,
  lua_State,
  lua_isstring,
  lua_pushboolean,
  lua_pushnil,
  lua_pushnumber,
  lua_pushstring,
  lua_tojsstring,
  lua_type,
  lua_typename,
} from '../../../scripting/lua';

export const IsShiftKeyDown = () => {
  return 0;
};

export const GetBuildInfo = (L: lua_State) => {
  lua_pushstring(L, 'Version');     // Version Type
  lua_pushstring(L, import.meta.env.VITE_BUILD_TYPE ?? 'dev');  // Build Type
  lua_pushstring(L, import.meta.env.VITE_VERSION ?? '');        // Version
  lua_pushstring(L, import.meta.env.VITE_COMMIT_HASH ?? '');    // Internal Version
  lua_pushstring(L, import.meta.env.VITE_BUILD_DATE ?? '');     // Build date
  return 1;
};

export const GetLocale = () => {
  return 0;
};

export const GetSavedAccountName = (L: lua_State) => {
  // TODO: Implementation
  lua_pushstring(L, '');
  return 1;
};

export const SetSavedAccountName = () => {
  return 0;
};

export const GetUsesToken = () => {
  return 0;
};

export const SetUsesToken = () => {
  return 0;
};

export const GetSavedAccountList = (L: lua_State) => {
  // TODO: Implementation
  lua_pushstring(L, '');
  return 1;
};

export const SetSavedAccountList = () => {
  return 0;
};

export const SetCurrentScreen = () => {
  return 0;
};

export const QuitGame = () => {
  console.error('QuitGame called');
  return 0;
};

export const QuitGameAndRunLauncher = () => {
  return 0;
};

export const PlayGlueMusic = (L: lua_State) => {
  if (!lua_isstring(L, 1)) {
    luaL_error(L, 'Usage: PlayGlueMusic("NameOfMusic")');
    return 0;
  }

  Client.instance.sound.playByName(lua_tojsstring(L, 1));
  return 0;
};

export const PlayCreditsMusic = () => {
  return 0;
};

export const StopGlueMusic = () => {
  return 0;
};

export const GetMovieResolution = () => {
  return 0;
};

export const GetScreenWidth = (L: lua_State) => {
  const ddcx = NDCtoDDCWidth(1.0);
  const ndcx = DDCtoNDCWidth(maxAspectCompensation * ddcx);
  lua_pushnumber(L, ndcx);
  return 1;
};

export const GetScreenHeight = (L: lua_State) => {
  const ddcy = NDCtoDDCHeight(1.0);
  const ndcx = DDCtoNDCWidth(maxAspectCompensation * ddcy);
  lua_pushnumber(L, ndcx);
  return 1;
};

export const LaunchURL = (L: lua_State) => {
  if (lua_isstring(L, 1)) {
    window.open(lua_tojsstring(L, 1), '_blank');
  } else {
    const type = lua_typename(L, lua_type(L, 1));
    console.error(`Could not open URL: unexpected ${type}`);
  }
  return 0;
};

export const ShowTOSNotice = () => {
  return 0;
};

export const TOSAccepted = (L: lua_State) => {
  // TODO: Implementation
  lua_pushboolean(L, 1);
  return 1;
};

export const AcceptTOS = () => {
  return 0;
};

export const ShowEULANotice = () => {
  return 0;
};

export const EULAAccepted = (L: lua_State) => {
  // TODO: Implementation
  lua_pushboolean(L, 1);
  return 1;
};

export const AcceptEULA = () => {
  return 0;
};

export const ShowTerminationWithoutNoticeNotice = () => {
  return 0;
};

export const TerminationWithoutNoticeAccepted = (L: lua_State) => {
  // TODO: Implementation
  lua_pushboolean(L, 1);
  return 1;
};

export const AcceptTerminationWithoutNotice = () => {
  return 0;
};

export const ShowScanningNotice = () => {
  return 0;
};

export const ScanningAccepted = () => {
  return 0;
};

export const AcceptScanning = () => {
  return 0;
};

export const ShowContestNotice = () => {
  return 0;
};

export const ContestAccepted = () => {
  return 0;
};

export const AcceptContest = () => {
  return 0;
};

export const DefaultServerLogin = () => {
  return 0;
};

export const StatusDialogClick = () => {
  return 0;
};

export const GetServerName = () => {
  return 0;
};

export const DisconnectFromServer = () => {
  return 0;
};

export const IsConnectedToServer = () => {
  return 0;
};

export const EnterWorld = () => {
  return 0;
};

export const Screenshot = () => {
  return 0;
};

export const PatchDownloadProgress = () => {
  return 0;
};

export const PatchDownloadCancel = () => {
  return 0;
};

export const PatchDownloadApply = () => {
  return 0;
};

export const GetNumAddOns = (L: lua_State) => {
  // TODO: Implementation
  lua_pushnumber(L, 0);
  return 1;
};

export const GetAddOnInfo = () => {
  return 0;
};

export const LaunchAddOnURL = () => {
  return 0;
};

export const GetAddOnDependencies = () => {
  return 0;
};

export const GetAddOnEnableState = () => {
  return 0;
};

export const EnableAddOn = () => {
  return 0;
};

export const EnableAllAddOns = () => {
  return 0;
};

export const DisableAddOn = () => {
  return 0;
};

export const DisableAllAddOns = () => {
  return 0;
};

export const SaveAddOns = () => {
  return 0;
};

export const ResetAddOns = () => {
  return 0;
};

export const IsAddonVersionCheckEnabled = () => {
  return 0;
};

export const SetAddonVersionCheck = () => {
  return 0;
};

export const GetCursorPosition = () => {
  return 0;
};

export const ShowCursor = () => {
  return 0;
};

export const HideCursor = () => {
  return 0;
};

export const GetBillingTimeRemaining = () => {
  return 0;
};

export const GetBillingPlan = () => {
  return 0;
};

export const GetBillingTimeRested = () => {
  return 0;
};

export const SurveyNotificationDone = () => {
  return 0;
};

export const PINEntered = () => {
  return 0;
};

export const PlayGlueAmbience = () => {
  return 0;
};

export const StopGlueAmbience = () => {
  return 0;
};

export const GetCreditsText = () => {
  return 0;
};

export const GetClientExpansionLevel = (L: lua_State) => {
  // TODO: Wrath of the Lich King
  lua_pushnumber(L, 3);
  return 1;
};

export const MatrixEntered = () => {
  return 0;
};

export const MatrixRevert = () => {
  return 0;
};

export const MatrixCommit = () => {
  return 0;
};

export const GetMatrixCoordinates = () => {
  return 0;
};

export const ScanDLLStart = () => {
  return 0;
};

export const ScanDLLContinueAnyway = () => {
  return 0;
};

export const IsScanDLLFinished = (L: lua_State) => {
  // TODO: Implementation
  lua_pushboolean(L, 1);
  return 1;
};

export const IsWindowsClient = () => {
  return 0;
};

export const IsOtherPlatformClient = () => {
  return 0;
};

export const IsMacClient = IsOtherPlatformClient;

export const IsLinuxClient = IsOtherPlatformClient;

export const SetRealmSplitState = () => {
  return 0;
};

export const RequestRealmSplitInfo = () => {
  return 0;
};

export const CancelLogin = () => {
  return 0;
};

export const GetCVar = () => {
  return 0;
};

export const GetCVarBool = () => {
  return 0;
};

export const SetCVar = () => {
  return 0;
};

export const GetCVarDefault = () => {
  return 0;
};

export const GetCVarMin = () => {
  return 0;
};

export const GetCVarMax = () => {
  return 0;
};

export const GetCVarAbsoluteMin = () => {
  return 0;
};

export const GetCVarAbsoluteMax = () => {
  return 0;
};

export const GetChangedOptionWarnings = () => {
  return 0;
};

export const AcceptChangedOptionWarnings = () => {
  return 0;
};

export const ShowChangedOptionWarnings = (L: lua_State) => {
  // TODO: Implementation
  lua_pushnil(L);
  return 1;
};

export const TokenEntered = () => {
  return 0;
};

export const GetNumDeclensionSets = () => {
  return 0;
};

export const DeclineName = () => {
  return 0;
};

export const GetNumGameAccounts = () => {
  return 0;
};

export const GetGameAccountInfo = () => {
  return 0;
};

export const SetGameAccount = () => {
  return 0;
};

export const StopAllSFX = () => {
  return 0;
};

export const SetClearConfigData = () => {
  return 0;
};

export const RestartGx = () => {
  return 0;
};

export const RestoreVideoResolutionDefaults = () => {
  return 0;
};

export const RestoreVideoEffectsDefaults = () => {
  return 0;
};

export const RestoreVideoStereoDefaults = () => {
  return 0;
};

export const IsStreamingMode = () => {
  return 0;
};

export const IsStreamingTrial = () => {
  return 0;
};

export const IsConsoleActive = () => {
  return 0;
};

export const RunScript = () => {
  return 0;
};

export const ReadyForAccountDataTimes = () => {
  return 0;
};

export const IsTrialAccount = (L: lua_State) => {
  // TODO: Implementation
  lua_pushnil(L);
  return 1;
};

export const IsSystemSupported = (L: lua_State) => {
  // TODO: Implementation
  lua_pushboolean(L, 1);
  return 1;
};
