"use strict";

import * as shaderUtils from '../common/shaderUtils.js'
const mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

const duration = 10000; // ms

// in: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.

const vertexShaderSource = `#version 300 es
        in vec3 vertexPos; // Vertex from the buffer
        in vec4 vertexColor;
        out vec4 color;
        uniform mat4 modelViewMatrix; // Object's position
        uniform mat4 projectionMatrix; // Camera's position
        void main(void) {
    		// Return the transformed and projected vertex value
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
            color = vertexColor * 0.8;
        }`;

const fragmentShaderSource = `#version 300 es
        precision mediump float;
        in vec4 color;
        out vec4 fragColor;
        void main(void) {
        fragColor = color;
    }`;

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    const gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initGL(canvas);
    
    //let cube = createCube(gl, [2 , 0, -2], [0, 0, 1]);
    let cube2 = createOctahedro(gl, [-2, 1.5, -2],  [1.0, 1.0, 0.2]);
    let dodecaedro = createDodecaedro(gl, [-2, -1.5, -2], [1.0, 1.0, 0.2]);
    let scutoide = createScutoide(gl, [2, -1.5, -2], [1.0, 1.0, 0.2])

    const shaderProgram = shaderUtils.initShader(gl, vertexShaderSource, fragmentShaderSource);
    bindShaderAttributes(gl, shaderProgram);

    update(gl, shaderProgram, [ cube2, dodecaedro, scutoide]);
}

function initWebGL(canvas)
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";
    try {
        gl = canvas.getContext("webgl2");
    } 
    catch (e) {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl) {
        throw new Error(msg);
    }

    return gl;        
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    // mat4.orthoNO(projectionMatrix, -4, 4, -3.5, 3.5, 1, 100)
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

// Create the vertex, color and index data for a multi-colored cube
function createDodecaedro(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
         0.00,  0.16,  0.41,  
         0.25,  0.25,  0.25,            
         0.16,  0.41,  0.00,
        -0.16,  0.41,  0.00, 
        -0.25,  0.25,  0.25,             
        
         0.25,  0.25,  0.25,             
         0.41,  0.00,  0.16, 
         0.41,  0.00, -0.16,
         0.25,  0.25, -0.25,             
         0.16,  0.41,  0.00,  

         0.41,  0.00, -0.16, 
         0.25, -0.25, -0.25,            
         0.00, -0.16, -0.41,
         0.00,  0.16, -0.41, 
         0.25,  0.25, -0.25,             

         0.00, -0.16, -0.41, 
        -0.25, -0.25, -0.25,            
        -0.41,  0.00, -0.16, 
        -0.25,  0.25, -0.25,             
         0.00,  0.16, -0.41,  

        -0.25, -0.25, -0.25,             
        -0.16, -0.41,  0.00,  
        -0.25, -0.25,  0.25,              
        -0.41,  0.00,  0.16,   
        -0.41,  0.00, -0.16,  

        -0.25,  0.25, -0.25,               
        -0.41,  0.00, -0.16,  
        -0.41,  0.00,  0.16,   
        -0.25,  0.25,  0.25,               
        -0.16,  0.41,  0.00,   

        -0.41,  0.00,  0.16,  
        -0.25, -0.25,  0.25,             
         0.00, -0.16,  0.41,  
         0.00,  0.16,  0.41,   
        -0.25,  0.25,  0.25,              

         0.25, -0.25, -0.25,              
         0.16, -0.41,  0.00,   
        -0.16, -0.41,  0.00,  
        -0.25, -0.25, -0.25,             
         0.00, -0.16, -0.41,  

         0.00,  0.16,  0.41,    
         0.00, -0.16,  0.41,   
         0.25, -0.25,  0.25,               
         0.41,  0.00,  0.16,    
         0.25,  0.25,  0.25,                

         0.41,  0.00,  0.16,    
         0.25, -0.25,  0.25,               
         0.16, -0.41,  0.00,   
         0.25, -0.25, -0.25,              
         0.41,  0.00, -0.16,   

         0.25,  0.25, -0.25,               
         0.00,  0.16, -0.41,   
        -0.25,  0.25, -0.25,              
        -0.16,  0.41,  0.00,   
         0.16,  0.41,  0.00,    

        -0.25, -0.25,  0.25,              
        -0.16, -0.41,  0.00,  
         0.16, -0.41,  0.00,   
         0.25, -0.25,  0.25,               
         0.00, -0.16,  0.41,    

    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    //Colores en orden binario para evitar repetir
    let faceColors = [
        [1.0, 1.0, 1.0, 1.0], 
        [0.0, 1.0, 1.5, 1.0], 
        [1.0, 1.0, 1.0, 1.0], 
        [0.0, 0.75, 1.0, 1.0], 
        [1.0, 0.0, 1.0, 1.0], 
        [0.25, 1.5, 0.0, 1.0], 
        [0.0, 1.0, 0.5, 1.0], 
        [1.0, 0.5, 0.25, 1.0], 
        [0.5, 1.0, 1.0, 1.0], 
        [1.0, 0.5, 0.0, 1.0], 
        [1.0, 0.5, 1.0, 1.0],                 
        [0.5, 0.75, 0.5, 1.0], 
    ];

    const faceVertex = [5,5,5,5,5,5,5,5,5,5,5,5];
    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }

    // con este for facilitamos el uso del color, ya no es necesario poner colores repetidos
    for(let i = 0; i < faceColors.length; i++){
        const color = faceColors[i];
        for(let j = 0; j < faceVertex[i]; j++){
            vertexColors.push(...color);
        }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let dodeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodeIndexBuffer);

    //Los indices de las caras
    let indices = [
         0,  1,  2,  0,  2,  3,  0,  3,  4,
         5,  6,  7,  5,  7,  8,  5,  8,  9,
        10, 11, 12, 10, 12, 13, 10, 13, 14,
        15, 16, 17, 15, 17, 18, 15, 18, 19,
        20, 21, 22, 20, 22, 23, 20, 23, 24,
        25, 26, 27, 25, 27, 28, 25, 28, 29,
        30, 31, 32, 30, 32, 33, 30, 33, 34,
        35, 36, 37, 35, 37, 38, 35, 38, 39,
        40, 41, 42, 40, 42, 43, 40, 43, 44,
        45, 46, 47, 45, 47, 48, 45, 48, 49,
        50, 51, 52, 50, 52, 53, 50, 53, 54,
        55, 56, 57, 55, 57, 58, 55, 58, 59,
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    let cube = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: dodeIndexBuffer,
        vertSize: 3, nVerts: 24, colorSize: 4, nColors: 20, nIndices: 108,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    };

    mat4.translate(cube.modelViewMatrix, cube.modelViewMatrix, translation);

    cube.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return cube;
}

function createScutoide(gl, translation, rotationAxis){
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
         1.00,  1.00,  0.00,              
         1.00,  0.62,  0.70,             
         1.00,  0.00,  0.50,            
         1.00,  0.00, -0.50,           
         1.00,  0.62, -0.70,           
   
         1.00,  0.00,  0.50,            
        -1.00,  0.00,  0.50,            
         1.00,  0.00, -0.50,           
        -1.00,  0.00, -0.50,           

         1.00,  0.62, -0.70,             
         1.00,  0.00, -0.50,              
        -1.00,  0.62, -0.70,               
        -1.00,  0.00, -0.50,                 

         1.00, 0.62,  0.70,            
         1.00, 0.00,  0.50,           
        -1.00, 0.62,  0.70,            
        -1.00, 0.00,  0.50,           

         1.00,  1.00,  0.00,                  
         1.00,  0.62,  0.70,                 
        -1.00,  0.62,  0.70,                 
        -0.40,  1.40,  0.00,                   

         1.00,  1.00,  0.00,                  
         1.00,  0.62, -0.70,               
        -1.00,  0.62, -0.70,               
        -0.40,  1.40,  0.00,   
        
        -1.00,  0.50,  0.00,        
        -1.00,  1.00,  0.50,      
        -1.00,  0.62,  0.70,   
        -1.00,  0.00,  0.50,      
        -1.00,  0.00, -0.50,     
        -1.00,  0.62, -0.70,  
        -1.00,  1.00, -0.50, 

        -0.40 ,  1.40,  0.00,       
        -1.00 ,  1.00,  0.50,       
        -1.00 ,  1.00, -0.50,   
        
        -0.40,  1.40,  0.00,         
        -1.00,  1.00,  0.50,        
        -1.00,  0.62,  0.70,        

        -0.40,  1.40,  0.00,       
        -1.00,  1.00, -0.50,       
        -1.00,  0.62, -0.70,       
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 0.0, 1.0, 1.0], // Top face
        [1.0, 1.0, 0.0, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0],  // Left face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0]  // Left face
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let i=0; i < 3; i++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0, 1, 2,
        0, 2, 3,  
        0, 3, 4,      
        5, 6, 7,   
        6, 7, 8,               
        9,12,10,  
       11, 9,12,         
       13,15,14,
       16,15,14,       
       17,19,18, 
       20,17,19,         
       21,23,22, 
       24,21,23,          
       26,25,27,  
       27,25,28,  
       28,25,29,  
       29,25,30, 
       30,25,31,  
       31,25,26, 
       32,33,34,              
       35,36,37,            
       38,39,40               
   ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let cube = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize: 3, nVerts: 24, colorSize: 4, nColors: 20, nIndices: 66,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(cube.modelViewMatrix, cube.modelViewMatrix, translation);

    cube.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
        
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, moveY, 0]);
    };
    
    return cube;
}

function createOctahedro(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
      // Face 1
      0, 1, 0,
      0, 0, 1,
      -1, 0, 0,
      // Face 2
      0, 1, 0,
      -1, 0, 0,
      0, 0, -1,
      // Face 3
      0, 1, 0,
      0, 0, -1,
      1, 0, 0,
      // Face 4
      0, 1, 0, 
      1, 0, 0,
      0, 0, 1,
      // Face 5
      0, -1, 0,
      0, 0, 1,
      -1, 0, 0,
      // Face 6
      0, -1, 0,
      -1, 0, 0,
      0, 0, -1,
      // Face 7
      0, -1, 0,
      0, 0, -1,
      1, 0, 0,
      // Face 8
      0, -1, 0,
      1, 0, 0,
      0, 0, 1,
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 0.0, 1.0, 1.0], // Top face
        [1.0, 1.0, 0.0, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0],  // Left face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0]  // Left face
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let i=0; i < 3; i++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17,
        18, 19, 20,
        21, 22, 23

    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let cube = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:24,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(cube.modelViewMatrix, cube.modelViewMatrix, translation);

    
    let counter = 0;
    let isUp = true;

    cube.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        let moveY = 0;

        if(counter >= 200 && isUp){
            isUp = false;
        }else if(counter <= -200 && !isUp){
            isUp = true;
        }else{
            if(isUp){
                counter++;
            }else{
                counter--;
            }
            moveY = isUp ? 0.01 : -0.01;            
        }

        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, moveY, 0]);
    };
    
    return cube;
}

function bindShaderAttributes(gl, shaderProgram)
{
    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function draw(gl, shaderProgram, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // set the shader to use
    gl.useProgram(shaderProgram);

    for(let i = 0; i< objs.length; i++)
    {
        let obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function update(gl, shaderProgram, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(()=> update(gl, shaderProgram, objs));

    draw(gl,shaderProgram, objs);

    objs.forEach(obj =>{
        obj.update();
    })
    // for(const obj of objs)
    //     obj.update();
    // for(let i = 0; i<objs.length; i++)
    //     objs[i].update();
}


main();