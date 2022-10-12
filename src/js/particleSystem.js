const data = [];

// bounds of the data
const bounds = {};

let maxConcentration = -Infinity;
let minConcentration = Infinity;

// creates the particle system
const createParticleSystem = (data) => {
    const bufferGeometry = new THREE.BufferGeometry();
    const pointPosition = []; // position of each of the points pushed as x y z

    // push updates to the geometry to create points from given dots
    for (let i = 0; i < data.length; i++) {
        pointPosition.push(data[i].X);
        pointPosition.push(data[i].Y);
        pointPosition.push(data[i].Z);
    }

    // separate it by x, y and z
    bufferGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( pointPosition, 3 ) );

    // setting the size of each of the point to 0.01
    const material = new THREE.PointsMaterial({ color: 0xffff00, size: 0.01 });
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
                maxConcentration = d.concentration;
            }

            if (d.concentration < minConcentration) {
                minConcentration = d.concentration;
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
        // create the particle system
        createParticleSystem(data);
    })
};


loadData('data/058.csv');