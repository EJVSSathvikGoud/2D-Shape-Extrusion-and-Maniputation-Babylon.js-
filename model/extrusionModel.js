import * as BABYLON from '@babylonjs/core'

import * as ExtrusionButton from '../button/extrusionButton.js'
import * as ModeButton from '../button/modeButton.js'

// Model for the application
const extrusionModel = {
    points: [],
    extrudedObject: null,
    shapeLines: null,
    closedLoop: false,
    vertices: []
};

// Proxy object for the extrusion model. Includes code for handling buttons on value changes
const modelProxy = new Proxy(extrusionModel, {
    set: function (target, key, value) {
        target[key] = value;
        switch (key) {
        case "closedLoop": 
            if (value) ExtrusionButton.handleExtrusionAvailable(modelProxy);
            else ExtrusionButton.handleExtrusionUnavailable(modelProxy);
            break;
        case "extrudedObject":
            if (value) ModeButton.handleExtrudedObjectAvailable();
            else ModeButton.handleExtrudedObjectUnavailable();
            break;
        }
        return true;
    }
});

// Extrude shape from added points
export function extrudeShape() {
    let path = [new BABYLON.Vector3(0, 0, -2), BABYLON.Vector3.Zero()];
    modelProxy.extrudedObject = BABYLON.Mesh.ExtrudeShape("extruded", modelProxy.points, path, 1, 0, 0);
    removeLines();
    modelProxy.closedLoop = false;
    const blueMaterial = new BABYLON.StandardMaterial("blueMaterial");
    blueMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
    blueMaterial.backFaceCulling = false;
    modelProxy.extrudedObject.material = blueMaterial;
}

// Returns true if the shape is already extruded
export function extrudedObjectExists() {
    return modelProxy.extrudedObject !== null;
}

// Add new points to the 2D shape
export function addNewPoint(point) {
    point._z = 0;
    modelProxy.points.push(point);
    if (modelProxy.points.length >= 2) {
        if (modelProxy.shapeLines) modelProxy.shapeLines.dispose();
        modelProxy.shapeLines = BABYLON.Mesh
            .CreateLines("shapeLines", modelProxy.points);
        modelProxy.shapeLines.color = new BABYLON.Color3(1, 0, 0);
    }
}

// Close the loop for the 2D shape. Removes the extruded object
export function closeLoop() {
    if (modelProxy.points.length < 3) return;
    modelProxy.points.push(modelProxy.points.at(0));
    if (modelProxy.shapeLines) modelProxy.shapeLines.dispose();
    modelProxy.shapeLines = BABYLON.Mesh
        .CreateLines("shapeLines", modelProxy.points);
    modelProxy.shapeLines.color = new BABYLON.Color3(1, 0, 0);
    if (modelProxy.extrudedObject) modelProxy.extrudedObject.dispose();
    modelProxy.extrudedObject = null;
    modelProxy.closedLoop = true;
}

// Remove points and extruded object from the model
export function resetPointsAndExtrusion() {
    removeLines();
    modelProxy.points = [];
    modelProxy.closedLoop = false;
    if (modelProxy.extrudedObject) modelProxy.extrudedObject.dispose();
    modelProxy.extrudedObject = null;
}

// Remove lines from the plane
export function removeLines() {
    if (modelProxy.shapeLines) {
        modelProxy.shapeLines.dispose();
        modelProxy.shapeLines = null;
    }
}

// Remove the vertex edit mode spherical vertices
export function removeVertices() {
    if (modelProxy.vertices) {
        modelProxy.vertices.forEach((vertex, index) => {vertex.dispose();});
        modelProxy.vertices = [];
    }
}

// Returns true is the mesh is extruded object
export function isExtrudedObject(mesh) {
    return mesh === modelProxy.extrudedObject;
}

// Update model when extruded object is moved by difference vector diff
export function moveExtrudedObject(diff) {
    modelProxy.extrudedObject.position.addInPlace(diff);
    let updatedPoints = new Set();
    modelProxy.points.forEach((point, index) => {
        if (!updatedPoints.has(point)) {
            point.addInPlace(diff);
            updatedPoints.add(point);
        }
    });
}

// Create spherical vertices for vertex edit mode if they do not exist
export function createVerticesIfNotExist() {
    if (modelProxy.vertices.length === 0) {
        let vertices = [];
        let visitedPoints = new Set();
        modelProxy.points.forEach((point, index) => {
            if (visitedPoints.has(point)) return;
            const sphere = new BABYLON.MeshBuilder.CreateSphere("vertex" + index.toString(), {diameter: 0.5});
            vertices.push(sphere);
            sphere.position = point;
            visitedPoints.add(point);
        });
        modelProxy.vertices = vertices;
    }
}

// update the model for vertex movement difference vector diff
export function moveVertex(diff, mesh) {
    diff._z = 0;
    modelProxy.extrudedObject.dispose();
    let updatedPoints = new Set();
    modelProxy.points.forEach((point, index) => {
        if(mesh.position === point && !updatedPoints.has(point)) {
            updatedPoints.add(point);
            point.addInPlace(diff);
        }
    });
    extrudeShape();
}

// Returns true if mesh is a vertex
export function isVertex(mesh) {
    return modelProxy.vertices.includes(mesh);
}

// Color the vertex mesh red when it is held
export function colorMeshForActive(mesh) {
    var redMaterial = new BABYLON.StandardMaterial("redMaterial");
    redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    mesh.material = redMaterial;
}

// Uncolor the vertex mesh when it is not held
export function colorMeshForInactive(mesh) {
    mesh.material = null;
}