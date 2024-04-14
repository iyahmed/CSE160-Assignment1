// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 30.0;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

let canvas, gl, a_Position, u_fragColor, u_Size; // Global variables

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const DRAWING = 3;

// Globals related to UI elements
let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedSize = 5;
let g_selectedSegment = 10;
let g_selectedType = POINT;

// Set up actions for the HTMl UI elements
function addActionsForHTMLUI() {
  // Button Events (Shape Type)
  document.getElementById('green').onclick = function () { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function () { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('clearButton').onclick = function () { g_shapesList = []; renderAllShapes(); };

  document.getElementById('pointButton').onclick = function () { g_selectedType = POINT };
  document.getElementById('triButton').onclick = function () { g_selectedType = TRIANGLE };
  document.getElementById('circleButton').onclick = function () { g_selectedType = CIRCLE };

  // Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100; });

  // Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function () { g_selectedSize = this.value; });

  // Segment Slider Events
  document.getElementById('segmentSlide').addEventListener('mouseup', function () { g_selectedSegment = this.value; });

  // Drawing Button Events
  document.getElementById('drawingButton').onclick = function () { g_selectedType = DRAWING; };
}

function main() {
  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shader progress and cibbecr GLSL variables 
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();


  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;
  canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev); } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Render all shapes (needed for performance reasons)
  renderAllShapes();
}

var g_shapesList = [];

//  var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = []; // The array to store the size of a point
function click(ev) {
  [x, y] = convertCoordinatesEventToGL(ev);

  // Create and store the new point
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    point.segment = g_selectedSegment;
    g_shapesList.push(point);
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    point.segment = g_selectedSegment;
    g_shapesList.push(point);
  } else if (g_selectedType == CIRCLE) {
    point = new Circle();
    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    point.segment = g_selectedSegment;
    g_shapesList.push(point);
  } else if (g_selectedType == DRAWING) {// TODO: Draw everything with triangles
    // Draw a diamond at the center
    let diamond = new Rectangle();
    diamond.position = [0, 0];
    diamond.color = g_selectedColor.slice();
    diamond.size = 40;
    diamond.segment = g_selectedSegment;
    g_shapesList.push(diamond);

    // Draw two reflected triangles at the center
    let reflected = new Rectangle();
    reflected.position = [0.5, 0];
    reflected.color = g_selectedColor.slice();
    reflected.size = 40;
    reflected.segment = g_selectedSegment;
    g_shapesList.push(reflected);

    // Draw a yellow Sun circle at the top
    let circle = new Circle();
    circle.position = [0.0, 0.5];
    circle.color = [1.0, 1.0, 0.0, 1.0];
    circle.size = 40;
    circle.segment = 16;
    g_shapesList.push(circle);
  }
  // Store the coordinates to g_points array
  // g_points.push([x, y]);

  // Store the color to g_points array
  // g_colors.push(g_selectedColor.slice());

  // Store the size to the g_sizes array
  // g_sizes.push(g_selectedSize);

  //  if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  //  } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  //  } else {                         // Others
  //    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  //  }

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Draw every shape that is supposed to be in the canvas
  renderAllShapes();

}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return ([x, y]);
}

function renderAllShapes() {// I could not include the perfomance montoring code because I do not have NodeJS setup
  // Check the time at the start of the function
  // var startTime = perfomance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // var len = g_points.length;
  var len = g_shapesList.length;

  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  // Check the time at the end of the function, and show on web page
  // var duration = perfomance.now() - startTime;
  // sendTextForHTML("numdot: " + len + " ms " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration), "numdot");
}

// Set the text of a HTML element
/*function sendTextToHTML(text, htmlID) {
var htmlElm = document.getElementById(htmlID);
if (!htmlElm) {
console.log("Failed to get: " + htmlID + " from HTML");
return;
}
htmlElm.innerHTML = text;
}*/