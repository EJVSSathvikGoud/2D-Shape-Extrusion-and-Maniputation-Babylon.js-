import {DrawMode} from '../mode/drawMode.js'
import {MoveMode} from '../mode/moveMode.js'
import {VertexMode} from '../mode/vertexMode.js'

const menuBar = document.getElementById('menuBar');
menuBar.appendChild(createDrawButton());
let currentMouseBehavior = null;
let scene = null;

// Button to enter draw mode
function createDrawButton() {
    var drawButton = document.createElement("button");
    drawButton.setAttribute("id", "DrawButton");
    drawButton.className = "SimpleButton";
    drawButton.innerText = "Draw";
    drawButton.addEventListener('click', function (event) {
        loadMode(DrawMode);
    });
    return drawButton;
}

// Button to enter move mode
function createMoveButton() {
    var moveButton = document.createElement("button");
    moveButton.setAttribute("id", "MoveButton");
    moveButton.className = "SimpleButton";
    moveButton.innerText = "Move";
    moveButton.addEventListener('click', function handleClick(event) {
        loadMode(MoveMode);
    });
    return moveButton;
}

// Button to enter vertex edit button
function createVertexEditButton() {
    var vertexEditButton = document.createElement("button");
    vertexEditButton.setAttribute("id", "VertexEditButton");
    vertexEditButton.className = "SimpleButton";
    vertexEditButton.innerText = "Vertex Edit";
    vertexEditButton.addEventListener('click', function handleClick(event) {
        loadMode(VertexMode);
    });
    return vertexEditButton;
}

// Remove existing mode's mouse behavior and load the new mode when the corresponding mode button is clicked
function loadMode(currentMode) {
    if (currentMouseBehavior) scene.onPointerObservable.removeCallback(currentMouseBehavior);
    currentMouseBehavior = (pointerInfo) => currentMode.mouseBehavior(pointerInfo, scene);
    scene.onPointerObservable.add(currentMouseBehavior);
}

// Initialize scene variable
export function initialize(sceneArg) {
    if (!scene) scene = sceneArg;
}

// function to handle extruded object available - update available mode buttons
export function handleExtrudedObjectAvailable() {
    if (!document.getElementById("MoveButton")) menuBar.appendChild(createMoveButton());
    if (!document.getElementById("VertexEditButton")) menuBar.appendChild(createVertexEditButton());
}

// function to handle extruded object unavailable - update available mode buttons
export function handleExtrudedObjectUnavailable() {
    if (document.getElementById("MoveButton")) menuBar.removeChild(document.getElementById("MoveButton"));
    if (document.getElementById("VertexEditButton")) menuBar.removeChild(document.getElementById("VertexEditButton"));
}