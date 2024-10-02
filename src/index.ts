import Client from './Client';
import ScriptingEvent from './ui/scripting/EventType';
import { ModelFFX } from './ui/components';
import * as glueScriptFunctions from './ui/scripting/globals/glue';
import { EventType as EngineEvent } from './event/Events';
import HTTPFileSystem from './resources/fs/HTTPFileSystem';

const params = new URLSearchParams(document.location.search);
const api = params.get('api') || 'webgl2';

const canvas = document.querySelector('canvas')!;
const fs = new HTTPFileSystem(import.meta.env.VITE_GAME_ASSET_URL ?? '')
const client = new Client(canvas, { api, fs });

// TODO: Part of GlueMgr
client.ui.scripting.registerFunctions(glueScriptFunctions);
client.ui.factories.register('ModelFFX', ModelFFX);

(async () => {
  console.time('Client load time');

  //await client.ui.load('Wowser\\Wowser.toc');
  await client.ui.load('Interface\\GlueXML\\GlueXML.toc');
  //await client.ui.load('Interface\\FrameXML\\FrameXML.toc');

  console.timeLog('Client load time');

  // TODO: Should be handled by GlueMgr
  client.ui.scripting.signalEvent(ScriptingEvent.FRAMES_LOADED);
  client.ui.scripting.signalEvent(ScriptingEvent.SET_GLUE_SCREEN, '%s', 'login');

  let last = new Date();
  const updateAndRender = () => {
    const now = new Date();
    const diff = +now - +last;


    client.ui.root.onLayerUpdate(diff);
    client.screen.render();

    last = now;
    //window.requestAnimationFrame(updateAndRender);
  };

  window.client = client;

  // Postpone rendering to allow resources to load (for now)
  setTimeout(updateAndRender, 1000);

  function canvasToWorldCoords(canvasX: number, canvasY: number) {
    const rect = canvas.getBoundingClientRect();
    const x = canvasX - rect.left;
    const y = canvasY - rect.top;
    const clipX = x / rect.width * 2 - 1;
    const clipY = y / rect.height * -2 + 1;
    return client.ui.renderer.mouseToWorldSpace(clipX, clipY);
  }

  canvas.addEventListener('mousedown', (event) => {
    const {x, y} = canvasToWorldCoords(event.x, event.y);
    client.events.processEvent(EngineEvent.MOUSEDOWN, { x, y, button: event.button });
  });
  canvas.addEventListener('mouseup', (event) => {
    const {x, y} = canvasToWorldCoords(event.x, event.y);
    client.events.processEvent(EngineEvent.MOUSEUP, { x, y, button: event.button });
  });
  canvas.addEventListener('mousemove', (event) => {
    const { x, y } = canvasToWorldCoords(event.x, event.y);
    client.events.processEvent(EngineEvent.MOUSEMOVE, { x, y, button: event.button });
  });
  window.addEventListener('keydown', (event) => {
    if (event.repeat) {
      client.events.processEvent(EngineEvent.KEYDOWN_REPEATING, { key: event.key });
    } else {
      client.events.processEvent(EngineEvent.KEYDOWN, { key: event.key });
    }
  });
  window.addEventListener('keyup', (event) => {
    client.events.processEvent(EngineEvent.KEYUP, { key: event.key });
  });
})();
