// Normal maps. 
// Normal maps provide a way to get even more surface detail than bump maps, still without using extra polygons. Normal maps tend to be larger and require more processing power than bump maps. Normal maps work by encoding actual vertex normal vector values into bitmaps as RGB data, typically at a much higher resolution than the associated mesh vertex data. The shader incorporates the normal information into its lighting calculations (along with current camera and light source values) to provide apparent surface detail. 

// Specular maps.
// Specular maps determine the intensity of specularity for each pixel. 

"use strict"; 

import * as THREE from '../../libs/three.js/three.module.js'
//import {addMouseHandler} from './solar_system_handler.js';
import { OrbitControls } from '../../libs/three.js/controls/OrbitControls.js'
import { OBJLoader } from '../../libs/three.js/loaders/OBJLoader.js'

import { MTLLoader } from '../../libs/three.js/loaders/MTLLoader.js'

let renderer = null, scene = null, camera = null, root = null, group = null, sphere = null, sphereNormalMapped = null;

let materials = {};

let duration = 10000; // ms
let currentTime = Date.now();
let animating = true;
let angle = 0;

let controls;

let timeScale = 50 ;

function main()
{
    let canvas = document.getElementById("webglcanvas");

    // create the scene
    createScene(canvas);
    
    // run the update loop
    update();
}

function animate() {

    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let currentAngleChange = Math.PI * 1 * fract;
    angle +=  Math.PI * 120 * fract;
    // orbits
    if(animating){
        //earth
        orbit(group.getObjectByName("sun"), toRadians(angle), 1, currentAngleChange, -1.5)
        orbit(group.getObjectByName("mercury"), toRadians(angle), 4, currentAngleChange, 58.6)
        orbit(group.getObjectByName("venus"), toRadians(angle), 1.6, currentAngleChange, 243)
        orbit(group.getObjectByName("earth"), toRadians(angle), 1, currentAngleChange )
        orbit(group.getObjectByName("mars"), toRadians(angle), 0.52, currentAngleChange, 1.03)
        group.getObjectByName("asteroids").rotation.y += currentAngleChange * -.25 * root.timeScale;
        orbit(group.getObjectByName("jupiter"), toRadians(angle), 0.084, currentAngleChange, 0.41)
        orbit(group.getObjectByName("saturn"), toRadians(angle), 0.0345, currentAngleChange, 0.45)
        orbit(group.getObjectByName("uranus"), toRadians(angle), 0.012, currentAngleChange, 0.72)
        orbit(group.getObjectByName("neptune"), toRadians(angle), 0.0061, currentAngleChange, 0.67)
        orbit(group.getObjectByName("pluto"), toRadians(angle), 0.00401, currentAngleChange, 6.39)
    }
    if(!window.x) window.x  = group.getObjectByName("mars");
}

function orbit(object, radian, scale, rotFactor, rotScale = 1){
    scale *= root.timeScale;
    //console.log(Math.cos(radian*scale) * object.radius, Math.sin(radian*scale) * object.radius)
    object.position.set(
        Math.cos(radian*scale) * object.radius,
        object.position.y,
        Math.sin(radian*scale) * object.radius
    )
    object.rotation.y += rotFactor * (1/rotScale)
    let moonGrp = object.getObjectByName("moongroup")
    moonGrp.rotation.y -= rotFactor*4;
    for(const child of moonGrp.children){
        if(child.name.includes("moon")){
            child.rotation.y -= rotFactor*10
        }
    }
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

function createMaterials()
{

    
    let sunUrl = "./Textures/2k_sun.jpg";
    let moonUrl = "./Textures/2k_moon.jpg";
    let mercuryUrl = "./Textures/2k_mercury.jpg";
    let venusUrl = "./Textures/2k_venus_atmosphere.jpg";
    let azerothUrl = './Textures/azeroth_4k.png';
    let marsUrl = "./Textures/2k_mars.jpg";
    let jupiterUrl = "./Textures/2k_jupiter.jpg";
    let saturnUrl = "./Textures/2k_saturn.jpg";
    let uranusUrl = "./Textures/2k_uranus.jpg";
    let neptuneUrl = "./Textures/2k_neptune.jpg";
    let plutoUrl = "./Textures/plutomap1k.jpg";
    let plutoBump = "./Textures/plutobump1k.jpg";
    
    let mapUrl = "../../images/earth_atmos_2048.jpg";

    const texture = new THREE.TextureLoader().load(mapUrl);
    const textureSun = new THREE.TextureLoader().load(sunUrl);
    const textureMoon = new THREE.TextureLoader().load(moonUrl);
    const textureMercury = new THREE.TextureLoader().load(mercuryUrl);
    const textureVenus = new THREE.TextureLoader().load(venusUrl);
    const textureAzeroth = new THREE.TextureLoader().load(azerothUrl);
    const textureMars = new THREE.TextureLoader().load(marsUrl);
    const textureJupiter = new THREE.TextureLoader().load(jupiterUrl);
    const textureSaturn = new THREE.TextureLoader().load(saturnUrl);
    const textureUranus = new THREE.TextureLoader().load(uranusUrl);
    const textureNeptune = new THREE.TextureLoader().load(neptuneUrl);
    const texturePluto = new THREE.TextureLoader().load(plutoUrl);
    const textureBumpPluto = new THREE.TextureLoader().load(plutoBump);
    

    materials["sun"] = new THREE.MeshPhongMaterial({ map: textureSun, emissiveMap: textureSun});
    materials["sun"].emissive = new THREE.Color("#ffffff")
    materials["mercury"] =new THREE.MeshPhongMaterial({ map: textureMercury});
    materials["venus"] =new THREE.MeshPhongMaterial({ map: textureVenus});
    materials["earth"] =new THREE.MeshPhongMaterial({ map: textureAzeroth});
    materials["mars"] =new THREE.MeshPhongMaterial({ map: textureMars});
    materials["jupiter"] =new THREE.MeshPhongMaterial({ map: textureJupiter});
    materials["saturn"] =new THREE.MeshPhongMaterial({ map: textureSaturn});
    materials["uranus"] =new THREE.MeshPhongMaterial({ map: textureUranus});
    materials["neptune"] =new THREE.MeshPhongMaterial({ map: textureNeptune});
    materials["pluto"] =new THREE.MeshPhongMaterial({ map: texturePluto, bumpMap: textureBumpPluto, bumpScale: 0.01});
    materials["asteroid"] =new THREE.MeshPhongMaterial({ map: texture});
    materials["moon"] =new THREE.MeshPhongMaterial({ map: textureMoon});


    
}

function onKeyDown ( event )
{
    switch ( event.keyCode ) {

        case 32:
            animating = !animating;
            break;
    }

}

function createScene(canvas) 
{    
    //console.log(canvas)
    document.addEventListener( 'keydown', onKeyDown, false );

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();
     
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 100  ;
    
    //orbit control
    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();

    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // //Add a directional light to show off the object
    // let light = new THREE.DirectionalLight( 0xffffff, 2);

    // //Position the light out from the scene, pointing at the origin
    // light.position.set(.5, 0, 1);
    // root.add( light );

    // light = new THREE.AmbientLight ( 0xffffff );
    // root.add(light);
    const light = new THREE.PointLight( 0xffffff, 2, 100);
    light.position.set( 0,0,0);
    root.add( light );
    
    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    // Create all the materials
    createMaterials();
    
    //sun
    addPlanet(group, 0, 0, 0, 4, "sun")
    //mercury
    addPlanet(group, 5.5, 0, 0, .75, "mercury");
    //venus
    addPlanet(group, 8, 0, 0, 0.9, "venus");
    //Tierra
    addPlanet(group, 11, 0, 0, 1, "earth", 1);
    //Mars
    addPlanet(group, 14, 0, 0, 0.8, "mars", 2);

    //Asteroids
    addAsteroids(group)

    //Jupiter
    addPlanet(group, 24, 0, 0, 2, "jupiter", 79);
    //Saturn
    addPlanet(group, 30, 0, 0, 1.75, "saturn", 82);
    //Uranus
    addPlanet(group, 35, 0, 0, 1.25, "uranus", 27);
    //Neptune
    addPlanet(group, 40, 0, 0, 1.25, "neptune", 14);
    //Pluto
    addPlanet(group, 47, 0, 0, 0.5, "pluto");
    
    // Now add the group to our scene
    scene.add( root );
    root.timeScale = 1;

}

function addAsteroids(group){
    let astGroup = new THREE.Object3D;
    astGroup.name = "asteroids"
    let xmax = 20
    let xmin = 16

    let ymax = 1
    let ymin = -1

    //Load asteroid 1
    new MTLLoader().load("./Textures/ASTEROID_1_/Asteroid_1_LOW_MODEL_.mtl", function (materials) {
        materials.preload();
        new OBJLoader()
            .setMaterials(materials)
            .load("./Textures/ASTEROID_1_/Asteroid_1_LOW_MODEL_.obj", function (asteroid) {
                for(let i = 0; i < 360; i+=4){
                    let radian = toRadians(i);
                    let radiusRandom = Math.random() * (xmax - xmin) + xmin
                    let yRandom = Math.random() * (ymax - ymin) + ymin
                    let xMod = Math.cos(radian)
                    let zMod = Math.sin(radian)
            
                    // And put the geometry and material together into a mesh
                    let instance = asteroid.clone();
                    instance.position.copy(new THREE.Vector3(xMod*radiusRandom, yRandom, zMod*radiusRandom))
                    instance.name = "Asteroid"+i;
                    instance.radius = xMod*radiusRandom;
                    instance.scale.copy(new THREE.Vector3(.1, .1, .1))
                    
            
                    // Add the sphere mesh to our group
                    astGroup.add( instance );
                } 
            });
    });
    new MTLLoader().load("./Textures/ASTEROID_2_/Asteroid_2_LOW_MODEL_.mtl", function (materials) {
        materials.preload();
        new OBJLoader()
            .setMaterials(materials)
            .load("./Textures/ASTEROID_2_/Asteroid_2_LOW_MODEL_.obj", function (asteroid) {
                for(let i = 0; i < 360; i+=4){
                    let radian = toRadians(i);
                    let radiusRandom = Math.random() * (xmax - xmin) + xmin
                    let yRandom = Math.random() * (ymax - ymin) + ymin
                    let xMod = Math.cos(radian)
                    let zMod = Math.sin(radian)
            
                    // And put the geometry and material together into a mesh
                    let instance = asteroid.clone();
                    instance.position.copy(new THREE.Vector3(xMod*radiusRandom, yRandom, zMod*radiusRandom))
                    instance.name = "Asteroid"+i;
                    instance.radius = xMod*radiusRandom;
                    instance.scale.copy(new THREE.Vector3(.1, .1, .1))
                    
            
                    // Add the sphere mesh to our group
                    astGroup.add( instance );
                } 
            });
    });
    new MTLLoader().load("./Textures/ASTEROID_3_/Asteroid_3_LOW_MODEL_.mtl", function (materials) {
        materials.preload();
        new OBJLoader()
            .setMaterials(materials)
            .load("./Textures/ASTEROID_3_/Asteroid_3_LOW_MODEL_.obj", function (asteroid) {
                for(let i = 0; i < 360; i+=4){
                    let radian = toRadians(i);
                    let radiusRandom = Math.random() * (xmax - xmin) + xmin
                    let yRandom = Math.random() * (ymax - ymin) + ymin
                    let xMod = Math.cos(radian)
                    let zMod = Math.sin(radian)
            
                    // And put the geometry and material together into a mesh
                    let instance = asteroid.clone();
                    instance.position.copy(new THREE.Vector3(xMod*radiusRandom, yRandom, zMod*radiusRandom))
                    instance.name = "Asteroid"+i;
                    instance.radius = xMod*radiusRandom;
                    instance.scale.copy(new THREE.Vector3(.1, .1, .1))
                    
            
                    // Add the sphere mesh to our group
                    astGroup.add( instance );
                } 
            });
    });
    new MTLLoader().load("./Textures/ASTEROID_4_/Asteroid_4_LOW_MODEL_.mtl", function (materials) {
        materials.preload();
        new OBJLoader()
            .setMaterials(materials)
            .load("./Textures/ASTEROID_4_/Asteroid_4_LOW_MODEL_.obj", function (asteroid) {
                for(let i = 0; i < 360; i+=4){
                    let radian = toRadians(i);
                    let radiusRandom = Math.random() * (xmax - xmin) + xmin
                    let yRandom = Math.random() * (ymax - ymin) + ymin
                    let xMod = Math.cos(radian)
                    let zMod = Math.sin(radian)
            
                    // And put the geometry and material together into a mesh
                    let instance = asteroid.clone();
                    instance.position.copy(new THREE.Vector3(xMod*radiusRandom, yRandom, zMod*radiusRandom))
                    instance.name = "Asteroid"+i;
                    instance.radius = xMod*radiusRandom;
                    instance.scale.copy(new THREE.Vector3(.1, .1, .1))
                    
            
                    // Add the sphere mesh to our group
                    astGroup.add( instance );
                } 
            });
    });
    
    const material = new THREE.LineBasicMaterial( { transparent: true, opacity: 0.5, color: 0xffffff } );
    const points = [];
    for(let i = 0; i <= 360; i++){
        let radian = toRadians(i)
        points.push(new THREE.Vector3(  
            Math.cos(radian) * 18,
            0,
            Math.sin(radian) * 18)
        )
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( orbitGeometry, material );
    group.add(line)
    
    group.add(astGroup)
}

function addPlanet(group, x, y, z, r, name, moons=0){

    
    let planetGroup = new THREE.Object3D;
    // Create the sphere geometry
    let geometry = new THREE.SphereGeometry(r, 20, 20);

    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, materials[name]);

    //orbit
    const material = new THREE.LineBasicMaterial( { transparent: true, opacity: 0.5, color: 0xffffff } );
    const points = [];
    for(let i = 0; i <= 360; i++){
        let radian = toRadians(i)
        points.push(new THREE.Vector3(  
            Math.cos(radian) * x,
            y,
            Math.sin(radian) * x)
        )
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( orbitGeometry, material );
    group.add(line)

    // Add the sphere mesh to our group
    planetGroup.add( sphere );
    planetGroup.position.copy(new THREE.Vector3(x, y, z))
    planetGroup.name = name;
    planetGroup.radius = x;

    let moonGroup = new THREE.Object3D;
    for(let i = 0; i < moons; i++){
        addMoon(moonGroup, r*.2, name+"_moon_"+i);
    }
    moonGroup.name = "moongroup"
    planetGroup.add(moonGroup)
    group.add(planetGroup);
 
}

function addMoon(group, r, name){
    
    let geometry = new THREE.SphereGeometry(.1, 10, 10);
    sphere = new THREE.Mesh(geometry, materials["moon"]);
    
    let lat = 2 * Math.PI * Math.random();
    let long = Math.acos(2*Math.random()-1);

    let x = r*7 * Math.cos(lat) * Math.cos(long);
    let y = r*7 * Math.cos(lat) * Math.sin(long);
    let z = r*7 * Math.sin(lat);
    
    sphere.position.copy(new THREE.Vector3(x, y, z))
    sphere.name = name;
    sphere.radius = r*7;
    
    group.add( sphere );
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

main();