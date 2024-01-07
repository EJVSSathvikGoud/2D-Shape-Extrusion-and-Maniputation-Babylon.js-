import * as BABYLON from '@babylonjs/core'

import {removeLines, removeVertices, isExtrudedObject, moveExtrudedObject} from '../model/extrusionModel.js'

let startingPoint;
let currentMesh;
let scene;
let canvas;

// Get position of extruded object with respect to plane
var getPlanePosition = function () {
    var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return !isExtrudedObject(mesh); });
    if (pickinfo.hit) {
        return pickinfo.pickedPoint;
    }
    return null;
}

// When mouse is down over extruded object, detach camera from canvas
var pointerDown = function (mesh) {
    currentMesh = mesh;
    startingPoint = getPlanePosition();
    if (startingPoint) {
        setTimeout(function () {
            scene.activeCamera.detachControl(canvas);
        }, 0);
    }
}

// When mouse is up over extruded object, reattach camera from canvas
var pointerUp = function () {
    if (startingPoint) {
        scene.activeCamera.attachControl(canvas, true);
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
    moveExtrudedObject(diff);
    startingPoint = current;
}

export class MoveMode {
    // Mouse logic for move mode
	static mouseBehavior(pointerInfo, sceneArg) {
		scene = sceneArg;
		removeLines();
        removeVertices();
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				if(pointerInfo.pickInfo.hit && isExtrudedObject(pointerInfo.pickInfo.pickedMesh)) {
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