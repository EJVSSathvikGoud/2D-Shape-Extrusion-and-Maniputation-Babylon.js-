import * as BABYLON from '@babylonjs/core'

import {createVerticesIfNotExist,
    removeLines,
    isVertex,
    colorMeshForActive,
    colorMeshForInactive,
    moveVertex} from '../model/extrusionModel.js'

let startingPoint;
let currentMesh;
let scene;
let canvas;

// Get position of selected vertex with respect to plane
var getPlanePosition = function () {
    var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return !isVertex(mesh); });
    if (pickinfo.hit) {
        return pickinfo.pickedPoint;
    }
    return null;
}

// When mouse is held on a vertex, detach camera from canvas
var pointerDown = function (mesh) {
    currentMesh = mesh;
    startingPoint = getPlanePosition();
    if (startingPoint) {
        setTimeout(function () {
            scene.activeCamera.detachControl(canvas);
        }, 0);
    }
    colorMeshForActive(mesh);
}

// When mouse is not held, reattach camera to canvas
var pointerUp = function () {
    if (startingPoint) {
        scene.activeCamera.attachControl(canvas, true);
        colorMeshForInactive(currentMesh);
        startingPoint = null;
    }
}

// Update the model for mouse movement
var pointerMove = function () {
    if (!startingPoint) {
        return;
    }
    var current = getPlanePosition();
    if (!current) {
        return;
    }

    var diff = current.subtract(startingPoint);
    moveVertex(diff, currentMesh);
    startingPoint = current;
}

export class VertexMode {
    // Mouse logic for vertex edit mode
	static mouseBehavior(pointerInfo, sceneArg) {
        createVerticesIfNotExist();
        removeLines();
		scene = sceneArg;
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				if(pointerInfo.pickInfo.hit && isVertex(pointerInfo.pickInfo.pickedMesh)) {
                    pointerDown(pointerInfo.pickInfo.pickedMesh)
                }
				break;
			case BABYLON.PointerEventTypes.POINTERUP:
                    pointerUp();
				break;
			case BABYLON.PointerEventTypes.POINTERMOVE:          
                    pointerMove();
				break;
        }
	}
};

