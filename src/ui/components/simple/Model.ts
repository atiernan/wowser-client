import Client from '../../../Client';
import { aspectCompensation, Status } from '../../../utils';
import Script from '../../scripting/Script';
import XMLNode from '../../XMLNode';
import Frame from './Frame';
import * as THREE from 'three';
import { Model as WowserModel, ModelManager } from '@wowserhq/scene';

import * as scriptFunctions from './Model.script';

const size = {
  width: 800,
  height: 600,
};
class Model extends Frame {
  camera?: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  light: THREE.PointLight;
  model?: WowserModel;
  #modelPath: string;
  background?: WowserModel;
  #modelManager: ModelManager;

  static get scriptFunctions() {
    return {
      ...super.scriptFunctions,
      ...scriptFunctions,
    };
  }

  constructor(parent: Frame | null) {
    super(parent);

    this.scripts.register(
      new Script('OnUpdateModel', ['button', 'down']),
    );

    this.#modelPath = '';
    const host = { baseUrl: import.meta.env.VITE_GAME_ASSET_URL, normalizePath: false };
    this.#modelManager = new ModelManager({ host });
  
    this.scene = new THREE.Scene();
  
    this.light = new THREE.PointLight('white', 1, 0, 0);
    this.light.position.set(0, 3, 2);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
    this.light.shadow.radius = 5;
    this.scene.add(this.light);
  }

  loadXML(node: XMLNode, status: Status): void {
    super.loadXML(node, status);
  }

  async setBackground(path: string) {
    this.#modelManager.get(path).then(({model, cameras}) => {
      this.#setCamera(cameras[0]);
      if (this.background) {
        this.scene.remove(this.background);
      }
      (model as THREE.Mesh).receiveShadow = true;
      this.scene.add(model as THREE.Mesh);
      this.background = model;
    });
  }

  #setCamera(camera: THREE.PerspectiveCamera) {
    if (this.camera) {
      this.scene.remove(this.camera);
    }
    const aspect = size.height / size.height;
    const fov = (camera.userData.fov / Math.sqrt(1.0 + Math.pow(aspect, 2.0)) * 57.2958);
    camera.aspect = aspect;
    camera.fov = fov;
    camera.updateProjectionMatrix();
    //camera.lookAt(-230.4928436279297,-79.17466735839844,-1.7550759315490723);
    this.camera = camera;
    this.scene.add(<THREE.PerspectiveCamera>this.camera);
  }

  async setModel(path: string)  {
    this.#modelManager.get(path).then(({model, cameras}) => {
      if (this.camera === undefined && cameras.length > 0) {
        this.#setCamera(cameras[0]);
      }
      if (this.model) {
        this.scene.remove(this.model);
      }

      this.scene.add(model as THREE.Mesh);
      this.model = model;
      console.log(path, this.model);
    });
  }

  onLayerUpdate(_elapsedSecs: number) {
    super.onLayerUpdate(_elapsedSecs);
    if (this.visible && _elapsedSecs === 0) {
      this.#render(_elapsedSecs);
    }
  }

  #render(_elapsedTime: number) {
    if (this.camera === undefined) {
      console.log('skipping render');
      return;
    }
    const renderer = Client.instance.screen.renderer;
    renderer.autoClear = false;
    this.#modelManager.update(0.05, this.camera);
    renderer.render(this.scene, this.camera);
    const x = ((this.rect.maxX + 1) * (Client.instance.screen.canvas.width)) / aspectCompensation;
    const y = ((this.rect.maxY + 1) * (Client.instance.screen.canvas.height)) / aspectCompensation;
    renderer.setViewport(0, 0, x, y);
    renderer.resetState();
    renderer.autoClear = true;
  }
}

export default Model;
