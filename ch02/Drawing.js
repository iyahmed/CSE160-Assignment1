class Drawing {// Check circle.js
    constructor() {
        this.type = 'drawing';
        this.position = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        this.size = 5.0
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw
        drawTriangle([xy[0], xy[1], xy[2], xy[3], xy[4], xy[6]]);
    }
}