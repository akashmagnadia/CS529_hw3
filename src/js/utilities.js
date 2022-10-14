let color_sequential_for_concentration = null;

// load up the data
const loadData = (file) => {

    // read the csv file
    d3.csv(file).then(function (fileData)
        // iterate over the rows of the csv file
    {
        fileData.forEach(d => {

            // get min and max concentration, x, y and z
            minConcentration = d.concentration < minConcentration ? Number(d.concentration) : minConcentration;
            maxConcentration = d.concentration > maxConcentration ? Number(d.concentration) : maxConcentration;
            minX = Number(d.Points0) < minX ? Number(d.Points0) : minX;
            maxX = Number(d.Points0) > maxX ? Number(d.Points0) : maxX;
            minY = Number(d.Points2) < minY ? Number(d.Points2) : minY;
            maxY = Number(d.Points2) > maxY ? Number(d.Points2) : maxY;
            minZ = Number(d.Points1) < minZ ? Number(d.Points1) : minZ;
            maxZ = Number(d.Points1) > maxZ ? Number(d.Points1) : maxZ;

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

        // change camera position to be in the middle of the cylinder
        leftCamera.position.set((minX + maxX) / 2, ((minY + maxY) / 2) + maxY, 10);
        leftCamera.lookAt(0, 0, minZ);

        rightCamera.position.set((minX + maxX) / 2, (minY + maxY) / 2, 10);
        rightCamera.lookAt((minX + maxX) / 2, ((minY + maxY) / 2), 0);

        // create the particle system that shows the cylinder and the flat picture
        createParticleSystem(data, true, leftScene);
        createParticleSystem(data, false, rightScene);
    })
};

// convert hex string to rgb tuple
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function updateTheAxis(shape) {
    shape.rotation.set(
        cylinderXAxis * (Math.PI/180),
        cylinderYAxis * (Math.PI/180),
        cylinderZAxis * (Math.PI/180)
    )
}

function moveTheRect(shape, zLoc) {
    if (rectZLoc < zLoc) {
        shape.translate(0, 0, Math.abs(rectZLoc - zLoc));
    }

    if (rectZLoc > zLoc) {
        shape.translate(0, 0, -Math.abs(rectZLoc - zLoc));
    }

    rectZLoc = zLoc;
}