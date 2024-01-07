import * as BABYLON from '@babylonjs/core'

import * as ModeButton from './button/modeButton.js'

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas);

// creating a scene with default camera and light
const createScene = function() {
    const scene = new BABYLON.Scene(engine);
    scene.createDefaultCameraOrLight(true, false, true);
    return scene;
};

const scene = createScene();

// our ground plane
const plane = BABYLON.Mesh.CreatePlane("plane", 10, scene);

// Initilize our mode button logic with scene
ModeButton.initialize(scene);

engine.runRenderLoop(function() {
    scene.render();
});

// handling window resize()
window.addEventListener('resize', function() {
    engine.resize();
});