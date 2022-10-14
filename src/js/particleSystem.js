const data = [];

let minConcentration = Infinity;
let maxConcentration = -Infinity;
let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
let minZ = Infinity;
let maxZ = -Infinity;

const minConcentrationColor = "#2873bb";
const maxConcentrationColor = "#fc5d5d";

let cylinderXAxis = 0;
let cylinderYAxis = 0;
let cylinderZAxis = 0;
let rectZLoc = 0;

loadData('data/058.csv');

// get color and position for each point
function getPointPositionAndColor(data, isCylinder, zLoc) {
    const pointPosition = []; // position of each of the points pushed as x y z
    const pointColor = []; // color of each point

    // push updates to the geometry to create points from given dots
    for (let i = 0; i < data.length; i++) {
        const currData = data[i];

        let currentPointColor = color_sequential_for_concentration(currData.concentration); // get color in rgb
        currentPointColor = d3.color(currentPointColor).formatHex(); // convert rgb to hex
        currentPointColor = hexToRgb(currentPointColor) // convert it to tuple so that they can be accessed individually

        if (isCylinder) {
            pointPosition.push(currData.X);
            pointPosition.push(currData.Y);
            pointPosition.push(currData.Z); // depth data

            pointColor.push(currentPointColor.r / 255);
            pointColor.push(currentPointColor.g / 255);
            pointColor.push(currentPointColor.b / 255);
        } else {
            if (currData.Z >= zLoc - 0.1 && currData.Z <= zLoc) {
                pointPosition.push(currData.X);
                pointPosition.push(currData.Y);
                pointPosition.push(0); // make flat square

                pointColor.push(currentPointColor.r / 255);
                pointColor.push(currentPointColor.g / 255);
                pointColor.push(currentPointColor.b / 255);
            }
        }
    }
    return {pointPosition, pointColor};
}

// create a particle system
const createParticleSystem = (data, isCylinder, scene, zLoc) => {
    const bufferGeometry = new THREE.BufferGeometry();
    const {pointPosition, pointColor} = getPointPositionAndColor(data, isCylinder, zLoc);

    // separate it by x, y and z
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointPosition, 3));

    // set the color using r g b with range of 0 to 1
    bufferGeometry.setAttribute('color', new THREE.Float32BufferAttribute(pointColor, 3));

    // setting the size of each of the point to 0.08
    const material = new THREE.PointsMaterial({size: 0.08, vertexColors: true});
    const points = new THREE.Points(bufferGeometry, material);

    // add the points of the cylinder to the scene
    scene.add(points);

    if (isCylinder) {
        // add filter rectangle to the scene with the cylinder
        const rectBoxGeometry = new THREE.BoxGeometry( Math.abs(minX) + maxX + 1, Math.abs(minY) + maxY + 1, 0.1).translate(0, 5, 0);
        const filterRect = new THREE.Mesh(
            rectBoxGeometry,
            new THREE.MeshBasicMaterial( {color: "#12ff00"} )
        );
        leftScene.add( filterRect );

        // rotate axis of the cylinder based on slider input
        d3.select("#xAxis").on("input", function() {
            cylinderXAxis = this.value;

            // adjust the text on the range slider
            d3.select("#xAxis-value").text(cylinderXAxis);
            d3.select("#xAxis").property("value", cylinderXAxis);

            updateTheAxis(points);
            updateTheAxis(filterRect);
        });

        d3.select("#yAxis").on("input", function() {
            cylinderYAxis = this.value;

            // adjust the text on the range slider
            d3.select("#yAxis-value").text(cylinderYAxis);
            d3.select("#yAxis").property("value", cylinderYAxis);

            updateTheAxis(points);
            updateTheAxis(filterRect);
        });

        d3.select("#zAxis").on("input", function() {
            cylinderZAxis = this.value;

            // adjust the text on the range slider
            d3.select("#zAxis-value").text(cylinderZAxis);
            d3.select("#zAxis").property("value", cylinderZAxis);

            updateTheAxis(points);
            updateTheAxis(filterRect);
        });

        d3.select("#rectFilter").on("input", function() {

            // adjust the text on the range slider
            d3.select("#rectFilter-value").text(this.value);
            d3.select("#rectFilter").property("value", this.value);

            moveTheRect(rectBoxGeometry, Number(this.value));
        });
    }

    // TODO: make credit page first
    // https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
    // https://www.educative.io/answers/how-to-rotate-an-object-on-its-own-axis-in-threejs
    // https://threejs.org/docs/
    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb hex to javascript
    // https://bl.ocks.org/d3noob/d6a2860e176eb6b0849f133be3a8a12f
    // https://www.educative.io/answers/how-to-rotate-an-object-on-its-own-axis-in-threejs
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
    //
};
