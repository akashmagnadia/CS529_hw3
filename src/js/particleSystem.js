const data = [];

// bounds of the data
const bounds = {};

let maxConcentration = -Infinity;
let minConcentration = Infinity;

const minConcentrationColor = "#d0f1fd";
const maxConcentrationColor = "#d7191c";

let color_sequential_for_concentration = null;

// creates the particle system
const createParticleSystem = (data) => {
    const bufferGeometry = new THREE.BufferGeometry();
    const pointPosition = []; // position of each of the points pushed as x y z
    const pointColor = []; // color of each point

    // push updates to the geometry to create points from given dots
    for (let i = 0; i < data.length; i++) {
        const currData = data[i];
        pointPosition.push(currData.X);
        pointPosition.push(currData.Y);
        pointPosition.push(currData.Z);

        let temp = color_sequential_for_concentration(currData.concentration);
        console.log(currData.concentration);
        console.log(temp);

        let currentPointColor = color_sequential_for_concentration(currData.concentration); // get color in rgb
        currentPointColor = d3.color(color_sequential_for_concentration(currData.concentration)).formatHex(); // convert rgb to hex
        currentPointColor = hexToRgb(currentPointColor) // convert it to tuple so that they can be accessed individually

        pointColor.push(currentPointColor.r/255);
        pointColor.push(currentPointColor.g/255);
        pointColor.push(currentPointColor.b/255);
    }

    console.log(minConcentration);
    console.log(maxConcentration);

    // separate it by x, y and z
    bufferGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( pointPosition, 3 ) );

    // set the color using r g b with range of 0 to 1
    bufferGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( pointColor, 3 ) );

    // setting the size of each of the point to 0.01
    const material = new THREE.PointsMaterial({ size: 0.01, vertexColors: true });
    const points = new THREE.Points(bufferGeometry, material);

    // add the containment to the scene
    scene.add(points);
};

const loadData = (file) => {

    // read the csv file
    d3.csv(file).then(function (fileData)
    // iterate over the rows of the csv file
    {
        fileData.forEach(d => {
            // get the min bounds
            bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
            bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
            bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);

            // get the max bounds
            bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
            bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
            bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);

            // get min and max concentration
            if (d.concentration > maxConcentration) {
                maxConcentration = Number(d.concentration);
            }

            if (d.concentration < minConcentration) {
                minConcentration = Number(d.concentration);
            }

            // add the element to the data collection
            data.push({
                // concentration density
                concentration: Number(d.concentration),
                // Position
                X: Number(d.Points0),
                Y: Number(d.Points2),
                Z: Number(d.Points1),
                // Velocity
                U: Number(d.velocity0),
                V: Number(d.velocity2),
                W: Number(d.velocity1)
            })
        });

        // set the scale for color difference for the cylinder
        color_sequential_for_concentration = d3
            .scaleSequential(d3.interpolate(minConcentrationColor, maxConcentrationColor))
            .domain([minConcentration, maxConcentration]);

        // create the particle system
        createParticleSystem(data);
    })
};


loadData('data/058.csv');

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}