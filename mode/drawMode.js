import * as BABYLON from '@babylonjs/core'

import {addNewPoint, closeLoop, resetPointsAndExtrusion, removeVertices} from '../model/extrusionModel.js'

// Add new point on left click
let handleLeftClick = (pointerInfo) => {
	let newPoint = pointerInfo._pickInfo.pickedPoint;
	if (newPoint) {
		addNewPoint(newPoint);
	}
}

// Close the loop on right click
let handleRightClick = (pointerInfo) => {
	closeLoop();
}

// Reset everything on middle click
let handleMiddleClick = (shape) => {
	resetPointsAndExtrusion();
}

export class DrawMode {
	// logic of mouse controls for drawmode
	static mouseBehavior(pointerInfo, shape, scene) {
		removeVertices();

		if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
		    if (pointerInfo.event.button === 0) {
		      handleLeftClick(pointerInfo);
		    } else if (pointerInfo.event.button === 2) {
		      handleRightClick(pointerInfo, shape, scene);
		    } else if (pointerInfo.event.button === 1) {
		    	handleMiddleClick(shape);
		    }
		}
	}
};