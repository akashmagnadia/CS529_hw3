
// Canvas
const leftCanvas = document.querySelector('canvas.leftScene');
const rightCanvas = document.querySelector('canvas.rightScene');

// Scene
const leftScene = new THREE.Scene();
const rightScene = new THREE.Scene();

// Lights
const leftLight = new THREE.DirectionalLight("#ffffff", 0.1);
leftLight.position.set(0,2,20);
leftScene.add(leftLight);

const rightLight = new THREE.DirectionalLight("#ffffff", 0.1);
rightLight.position.set(0,2,20);
rightScene.add(rightLight);

// Sizes
const sizes = {
    width: window.innerWidth * 0.45,
    height: window.innerHeight * 0.9
};

window.addEventListener('resize', () =>
{
    // get the size of the window again
    sizes.width = window.innerWidth * 0.45;
    sizes.height = window.innerHeight * 0.9;

    // Update camera
    leftCamera.aspect = sizes.width / sizes.height
    leftCamera.updateProjectionMatrix()

    rightCamera.aspect = sizes.width / sizes.height
    rightCamera.updateProjectionMatrix()

    // Update renderer
    leftRenderer.setSize(sizes.width, sizes.height)
    leftRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    rightRenderer.setSize(sizes.width, sizes.height)
    rightRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});


// Camera setup
const leftCamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000 );
leftCamera.position.set(0,2,20);
leftCamera.lookAt(0, 0, 0);
leftScene.add(leftCamera);

const rightCamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000 );
rightCamera.position.set(0,2,20);
rightCamera.lookAt(0, 0, 0);
rightScene.add(rightCamera);


//  Renderer
const leftRenderer = new THREE.WebGLRenderer({ canvas: leftCanvas });
leftRenderer.setSize(sizes.width, sizes.height);

const rightRenderer = new THREE.WebGLRenderer({ canvas: rightCanvas });
rightRenderer.setSize(sizes.width, sizes.height);


// sets up the background color
let backgroundColor = "#949494";
leftRenderer.setClearColor(backgroundColor);
leftRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

rightRenderer.setClearColor(backgroundColor);
rightRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Animate
const animate = () =>
{
    leftRenderer.render(leftScene, leftCamera);
    rightRenderer.render(rightScene, rightCamera);

    // Call animate for each frame
    window.requestAnimationFrame(animate);
};

animate();