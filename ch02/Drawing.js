class Drawing {// Check circle.js
    constructor() {
        this.type = 'drawing';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.multiplePoints = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    }

    render() {
        var multiplePoints = this.multiplePoints;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the size of a point to the u_Size variable
        gl.uniform1f(u_Size, size);

        console.log("MULTIPLE POINTS: ", multiplePoints[0], multiplePoints[1], multiplePoints[2], multiplePoints[3], multiplePoints[4], multiplePoints[5], multiplePoints[6], multiplePoints[7]);

        // Draw A 4 Triangle-Circle
        var d = this.size / 200; // delta
        drawTriangle([multiplePoints[0], multiplePoints[1], multiplePoints[0] + d, multiplePoints[1], multiplePoints[0], multiplePoints[1] + d]); // TODO: Fix it to render a wheel
    }
}

function drawTriangle(vertices) {
    // var vertices = new Float32Array([
    //    0, 0.5, -0.5, -0.5, 0.5, -0.5
    //  ]);
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //  if (a_Position < 0) {
    //  console.log('Failed to get the storage location of a_Position');
    //  return -1;
    //}
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    //return n;
}
