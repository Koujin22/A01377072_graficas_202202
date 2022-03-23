let projectionMatrix = null, shaderProgram = null;

let shaderVertexPositionAttribute = null, shaderVertexColorAttribute = null, shaderProjectionMatrixUniform = null, shaderModelViewMatrixUniform = null;

let mat4 = glMatrix.mat4;

let duration = 10000;

let vertexShaderSource = `#version 300 es
in vec3 vertexPos;
in vec4 vertexColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 vColor;

void main(void) {
    // Return the transformed and projected vertex value
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
    // Output the vertexColor in vColor
    vColor = vertexColor;
}`;

let fragmentShaderSource = `#version 300 es
    precision lowp float;
    in vec4 vColor;
    out vec4 fragColor;

    void main(void) {
    // Return the pixel color: always output white
    fragColor = vColor;
}
`;

let animationFrame;
let glCtx;

function createShader(glCtx, str, type)
{
    let shader = null;
    
    if (type == "fragment") 
        shader = glCtx.createShader(glCtx.FRAGMENT_SHADER);
    else if (type == "vertex")
        shader = glCtx.createShader(glCtx.VERTEX_SHADER);
    else
        return null;

    glCtx.shaderSource(shader, str);
    glCtx.compileShader(shader);

    if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        throw new Error(glCtx.getShaderInfoLog(shader));
    }

    return shader;
}

function initShader(glCtx, vertexShaderSource, fragmentShaderSource)
{
    const vertexShader = createShader(glCtx, vertexShaderSource, "vertex");
    const fragmentShader = createShader(glCtx, fragmentShaderSource, "fragment");

    let shaderProgram = glCtx.createProgram();

    glCtx.attachShader(shaderProgram, vertexShader);
    glCtx.attachShader(shaderProgram, fragmentShader);
    glCtx.linkProgram(shaderProgram);
    
    if (!glCtx.getProgramParameter(shaderProgram, glCtx.LINK_STATUS)) {
        throw new Error("Could not initialise shaders");
    }

    return shaderProgram;
}

function initWebGL(canvas) 
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";

    try 
    {
        gl = canvas.getContext("webgl2");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        throw new Error(msg);
    }

    return gl;        
}

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(gl, canvas)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
}

function draw(glCtx, objs) 
{
    // clear the background (with black)
    glCtx.clearColor(0.1, 0.1, 0.1, 1.0);
    glCtx.enable(glCtx.DEPTH_TEST);
    glCtx.clear(glCtx.COLOR_BUFFER_BIT | glCtx.DEPTH_BUFFER_BIT);

    // set the shader to use
    glCtx.useProgram(shaderProgram);

    for(const obj of objs)
    {
        glCtx.bindBuffer(glCtx.ARRAY_BUFFER, obj.buffer);
        glCtx.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, glCtx.FLOAT, false, 0, 0);

        glCtx.bindBuffer(glCtx.ARRAY_BUFFER, obj.colorBuffer);
        glCtx.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, glCtx.FLOAT, false, 0, 0);
        
        glCtx.bindBuffer(glCtx.ELEMENT_ARRAY_BUFFER, obj.indices);

        glCtx.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        glCtx.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        glCtx.drawElements(obj.primtype, obj.nIndices, glCtx.UNSIGNED_SHORT, 0);
    }
}


//a = [x, y, z]
function puntoMedioVertice(a, b){
    return [(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2];
}

//a = [x, y, z]
function generateVertices(depth, a, b, c, arrayVerts=[]){
    if(depth == 0) {
        arrayVerts.push(...a, ...b, ...c);
        return arrayVerts;
    }
    else{
        //vertices triangulo interior superior
        arrayVerts.push(...generateVertices(depth-1, a, puntoMedioVertice(a, b), puntoMedioVertice(a, c)))
        //vertices triangulo interior izquierdo
        arrayVerts.push(...generateVertices(depth-1, puntoMedioVertice(a, b), b, puntoMedioVertice(b, c)))
        //vertices triangulo interior izquierdo
        arrayVerts.push(...generateVertices(depth-1, puntoMedioVertice(a, c), puntoMedioVertice(b, c), c))
        return arrayVerts;
    }

}


/*

1 = 0, 1, 2
2 = 0, 3, 5; 3, 2, 4; 5, 4, 2;

*/

function test(){
    let pyramid = createPyramid(glCtx,  [0, 0, -2], [0, 1, 0], parseInt(document.getElementById("depth").value));
    restart(glCtx, [pyramid] )
}

function createPyramid(gl, translation, rotationAxis, depth=3) 
{
    let verts = generateVertices(depth, [0, .6, 0], [-.6, 0, .4], [.6, 0, .4]);
    verts.push(...generateVertices(depth, [0, .6, 0], [-.6, 0, .4], [0, 0, -.6]));
    verts.push(...generateVertices(depth, [0, .6, 0], [0, 0, -.6], [.6, 0, .4]));
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    let vertexColors = [];
    for(let i = 0; i < verts.length/3; i++){
        let newColor = [];
        newColor[0] = Math.random();
        newColor[1] = Math.random();
        newColor[2] = Math.random();
        newColor[3] = 1.0;
        for (let j=0; j < 3; j++)
            vertexColors.push(...newColor);
    }

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let pyramidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBuffer);

    let pyramidIndices =  []
    for(let i = 0; i < verts.length/3; i++){
        pyramidIndices[i] = i;
    }

    console.log(pyramidIndices)

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);
    console.log({ vertSize:3, nVerts:verts.length/3, colorSize:4, nColors: vertexColors.length / 4, nIndices: pyramidIndices.length})
    let pyramid = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:pyramidIndexBuffer,
            vertSize:3, nVerts:verts.length/3, colorSize:4, nColors: vertexColors.length / 4, nIndices: pyramidIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);
    mat4.rotate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, Math.PI/8, [1, 0, 0]);

    pyramid.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return pyramid;
}

function update(glCtx, objs)
{
    animationFrame = requestAnimationFrame(()=>update(glCtx, objs));

    draw(glCtx, objs);
    objs.forEach(obj => obj.update())
}

function restart(glCtx, objs)
{
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(()=>update(glCtx, objs));

    draw(glCtx, objs);
    objs.forEach(obj => obj.update())
}

function bindShaderAttributes(glCtx, shaderProgram)
{
    shaderVertexPositionAttribute = glCtx.getAttribLocation(shaderProgram, "vertexPos");
    glCtx.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = glCtx.getAttribLocation(shaderProgram, "vertexColor");
    glCtx.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = glCtx.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = glCtx.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function main()
{
    let canvas = document.getElementById("pyramidCanvas");
    glCtx = initWebGL(canvas);

    initViewport(glCtx, canvas);
    initGL(glCtx, canvas);

    let pyramid = createPyramid(glCtx,  [0, 0, -2], [0, 1, 0]);

    shaderProgram = initShader(glCtx, vertexShaderSource, fragmentShaderSource);
    bindShaderAttributes(glCtx, shaderProgram);

    update(glCtx, [pyramid]);
}

console.log("Starting");
document.getElementById("cambiar").onclick=test;
main();

console.log("ended");
