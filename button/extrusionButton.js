import {extrudeShape, extrudedObjectExists} from '../model/extrusionModel.js'

const menuBar = document.getElementById('menuBar');

// Button to begin extrusion
function createExtrusionButton() {
	var extrusionButton = document.createElement("button");
	extrusionButton.setAttribute("id", "ExtrusionButton");
	extrusionButton.className = "SimpleButton";
	extrusionButton.innerText = "Begin Extrusion";

	extrusionButton.addEventListener('click', function handleClick(event) {
		extrudeShape();
	});
	return extrusionButton;
}

// Update available buttons when 2D is available for extrusion
export function handleExtrusionAvailable() {
	if (extrudedObjectExists()){
		if (document.getElementById("ExtrusionButton")) menuBar.removeChild(document.getElementById("ExtrusionButton"));
	} else {
		if (document.getElementById("ExtrusionButton")) return;
		menuBar.appendChild(createExtrusionButton());
	}
}

// Update unavailable buttons when 2D is unavailable for extrusion
export function handleExtrusionUnavailable() {
	if (document.getElementById("ExtrusionButton")) menuBar.removeChild(document.getElementById("ExtrusionButton"));
}