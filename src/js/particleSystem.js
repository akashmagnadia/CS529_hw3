const data = [];

let minConcentration = Infinity;
let maxConcentration = -Infinity;
let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
let minZ = Infinity;
let maxZ = -Infinity;

const minConcentrationColor = "#ffffff";
const maxConcentrationColor = "#d7191c";

loadData('data/058.csv');

// get color and position for each point
function getPositionColor(data, isCylinder) {
    const pointPosition = []; // position of each of the points pushed as x y z
    const pointColor = []; // color of each point

    // push updates to the geometry to create points from given dots
    for (let i = 0; i < data.length; i++) {
        const currData = data[i];
        pointPosition.push(currData.X);
        pointPosition.push(currData.Y);
        if (isCylinder) {
            pointPosition.push(currData.Z); // depth data
        } else {
            pointPosition.push(0); // make flat square
        }

        let currentPointColor = color_sequential_for_concentration(currData.concentration); // get color in rgb
        currentPointColor = d3.color(color_sequential_for_concentration(currData.concentration)).formatHex(); // convert rgb to hex
        currentPointColor = hexToRgb(currentPointColor) // convert it to tuple so that they can be accessed individually

        pointColor.push(currentPointColor.r / 255);
        pointColor.push(currentPointColor.g / 255);
        pointColor.push(currentPointColor.b / 255);
    }
    return {pointPosition, pointColor};
}

// create a particle system
const createParticleSystem = (data, isCylinder, scene) => {
    const bufferGeometry = new THREE.BufferGeometry();
    const {pointPosition, pointColor} = getPositionColor(data, isCylinder);

    // separate it by x, y and z
    bufferGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( pointPosition, 3 ) );

    // set the color using r g b with range of 0 to 1
    bufferGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( pointColor, 3 ) );

    // setting the size of each of the point to 0.01
    const material = new THREE.PointsMaterial({ size: 0.07, vertexColors: true });
    const points = new THREE.Points(bufferGeometry, material);

    // add the containment to the scene
    scene.add(points);
};
