"use strict";

import * as THREE from "../libs/three.js/three.module.js"
import { addMouseHandler } from "./sceneHandlers.js"
import { GUI } from "../libs/three.js/libs/dat.gui.module.js"
let renderer = null, scene = null, camara = null, cube_1 = null, cube_2 = null, cube_3 = null, cube_4 = null, cube_5 = null, cube_6 = null
let shoulderGroup1 = null, shoulderGroup2 = null, camaraGroup = null, elbowGroup2 = null, elbowGroup1 = null, wristGroup2 = null, wristGroup1 = null, handGroup1 = null, handGroup2 = null;




const duration = 5000; // ms
let currentTime = Date.now();

function main() {
    setUpGUI();
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

/**
 * Updates the rotation of the objects in the scene
 */
function animate() {
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    const fract = deltat / duration;

    // Rotate the cube about its Y axis


}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update() {
    requestAnimationFrame(function () { update(); });

    // Render the scene
    renderer.render(scene, camara);

    // Spin the cube for next frame
    animate();
}

/**
 * Creates a basic scene with lights, a camara, and 3 objects
 * @param {canvas} canvas The canvas element to render on
 */
function createScene(canvas) {
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color(0.2, 0.2, 0.2);

    // Add  a camara so we can view the scene
    camara = new THREE.Perspectivecamara(45, canvas.width / canvas.height, 1, 10000);
    //camara.position.z = 12;
    camara.position.set(0, 0, 15);
    //scene.add(camara);



    // Add a directional light to show off the objects
    const light = new THREE.DirectionalLight(0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(3, 4, 5);
    light.target.position.set(0, 0, 0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    const ambientLight = new THREE.AmbientLight(0xffccaa, 0.4);
    scene.add(ambientLight);


    const geometryPiso = new THREE.BoxGeometry(20, 0.1, 20);
    const textureUrl = "../images/checker_large.gif";
    const texture = new THREE.TextureLoader().load(textureUrl);
    const materialPiso = new THREE.MeshPhongMaterial({ map: texture });
    const piso = new THREE.Mesh(geometryPiso, materialPiso);
    piso.position.set(0, -4.2, 0);
    scene.add(piso);




    //Cubo 1
    const geometry1 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const textureUrl1 = "../images/companionCube.png";
    const texture1 = new THREE.TextureLoader().load(textureUrl1);
    const material1 = new THREE.MeshPhongMaterial({ map: texture1 });
    cube_1 = new THREE.Mesh(geometry1, material1);
    cube_1.position.set(0, 3, 0);
    scene.add(cube_1);


    //Cubo 2
    const geometry2 = new THREE.BoxGeometry(0.8, 2, 0.8);
    cube_2 = new THREE.Mesh(geometry2, material1);
    cube_2.position.set(0, 1.7, 0);
    scene.add(cube_2);


    //Cubo 3
    const geometry3 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    cube_3 = new THREE.Mesh(geometry1, material1);
    cube_3.position.set(0, 0.42, 0);
    scene.add(cube_3);

    //Cubo 4
    const geometry4 = new THREE.BoxGeometry(0.8, 2, 0.8);
    cube_4 = new THREE.Mesh(geometry4, material1);
    cube_4.position.set(0, -0.85, 0);
    scene.add(cube_4);

    //Cubo 5
    const geometry5 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    cube_5 = new THREE.Mesh(geometry5, material1);
    cube_5.position.set(0, -2.1, 0);
    scene.add(cube_5);

    //Cubo 6
    const geometry6 = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    cube_6 = new THREE.Mesh(geometry6, material1);
    cube_6.position.set(0, -2.72, 0);
    scene.add(cube_6);


    /*
    Encargado de mover la camara tocando con el mouse la pantalla. Se agrega la camara a un grupo y este gupo a su vez se agrega a la escena.
    */
    camaraGroup = new THREE.Object3D;
    camaraGroup.add(camara);
    scene.add(camaraGroup);

    /*
    Estos grupos tienen la finalidad de arreglor el problema de la rotación.
    Cuando gira el grupo 1 se mueve el grupo 2 en la posición Y para simular la rotación correcta.
    */
    shoulderGroup1 = new THREE.Object3D;
    shoulderGroup2 = new THREE.Object3D;


    elbowGroup1 = new THREE.Object3D;
    elbowGroup2 = new THREE.Object3D;

    wristGroup1 = new THREE.Object3D;

    wristGroup2 = new THREE.Object3D;

    handGroup1 = new THREE.Object3D;

    handGroup2 = new THREE.Object3D;


    elbowGroup1.add(elbowGroup2);
    shoulderGroup1.add(shoulderGroup2);
    wristGroup1.add(wristGroup2);
    handGroup1.add(handGroup2);
    handGroup2.add(cube_6);
    wristGroup2.add(cube_5); wristGroup2.add(handGroup1);
    elbowGroup2.add(cube_3); elbowGroup2.add(cube_4); elbowGroup2.add(wristGroup1);
    shoulderGroup2.add(cube_1); shoulderGroup2.add(cube_2); shoulderGroup2.add(elbowGroup1);


    scene.add(shoulderGroup1);

    shoulderGroup1.position.set(0, 2, 0);
    shoulderGroup2.position.set(0, -3, 0);
    elbowGroup1.position.set(0, 0.55, 0);
    elbowGroup2.position.set(0, -0.5, 0);
    wristGroup1.position.set(0, -1.8, 0);
    wristGroup2.position.set(0, 1.8, 0);
    handGroup1.position.set(0, -2.5, 0);
    handGroup2.position.set(0, 2.5, 0);
    
    addMouseHandler(canvas, camaraGroup);
}

let setUpGUI = () => {
    let gui = new GUI({ width: 200 })


    let UI_data = {
        shoulder_x: 0.0,
        shoulder_z: 0.0,
        elbow_x: 0.0,
        forearm_y: 0.0,
        wrist_x: 0.0,
        hand_x: 0.0,
        hand_z: 0.0
    }

    let slider_shoulder_x = gui.add(UI_data, 'shoulder_x').min(-1.5).max(1.5).step(0.001);
    let slider_shoulder_z = gui.add(UI_data, 'shoulder_z').min(-2).max(2).step(0.001);
    let slider_elbow_z = gui.add(UI_data, 'elbow_x').min(-2).max(1).step(0.001);
    let slider_forearm_y = gui.add(UI_data, 'forearm_y').min(-1).max(1).step(0.001);
    let slider_wrist_x = gui.add(UI_data, 'wrist_x').min(-1).max(1).step(0.001);
    let slider_hand_x = gui.add(UI_data, 'hand_x').min(-1).max(1).step(0.001);
    let slider_hand_z = gui.add(UI_data, 'hand_z').min(-1).max(1).step(0.001);

    slider_shoulder_x.onChange((valor) => {
        shoulderGroup1.rotation.x = valor;
    });

    slider_shoulder_z.onChange((valor) => {
        shoulderGroup1.rotation.z = valor;
    });

    slider_elbow_z.onChange((valor) => {
        elbowGroup1.rotation.x = valor;
    });

    slider_forearm_y.onChange((valor) => {
        elbowGroup2.rotation.y = valor;
    });

    slider_wrist_x.onChange((valor) => {
        wristGroup1.rotation.x = valor;
    });

    slider_hand_x.onChange((valor) => {
        handGroup1.rotation.x = valor;
    });

    slider_hand_z.onChange((valor) => {
        handGroup1.rotation.z = valor;
    });
}

main();