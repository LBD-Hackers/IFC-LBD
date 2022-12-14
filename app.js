import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { LBDParser } from "../../lib/bundles/browser/bundle.esm";
import { IfcAPI } from "web-ifc";

//Creates the Three.js scene
const scene = new Scene();
let file;

initScene();

// Event: Upload file
const input = document.getElementById("file-input");
  input.addEventListener(
    "change",
    async (changed) => {

      // Set file
      file = changed.target.files[0];

      // Unhide parsing options
      document.getElementById("parsers").classList.remove("hidden");

      // Hide file uoload
      document.getElementById("file-input").classList.add("hidden");

      // Load in viewer
      document.getElementById("status").innerHTML = "Loading model in scene...";
      await loadInViewer();
      document.getElementById("status").innerHTML = "";

    },
    false
);

// Event: Do parse
document.getElementById("bot-parse").addEventListener("click", () => parseTriples("bot"));
document.getElementById("products-parse").addEventListener("click", () => parseTriples("prod"));
document.getElementById("props-parse").addEventListener("click", () => parseTriples("props"));
document.getElementById("fso-parse").addEventListener("click", () => parseTriples("fso"));

async function parseTriples(subset){

    document.getElementById("status").innerHTML = "Reading file...";
    const arrayBuffer = await readFile(file);

    document.getElementById("status").innerHTML = "Loading model...";
    const ifcAPI = new IfcAPI();
    ifcAPI.SetWasmPath("./assets/");
    await ifcAPI.Init();
    const modelID = ifcAPI.OpenModel(new Uint8Array(arrayBuffer));
    
    document.getElementById("status").innerHTML = "Parsing LBD triples...";
    console.time("Parsing done");
    const lbdParser = new LBDParser();
    let triples = "";
    switch(subset){
        case "bot":
            triples = await lbdParser.parseBOTTriples(ifcAPI, modelID);
            break;
        case "prod":
            triples = await lbdParser.parseProductTriples(ifcAPI, modelID);
            break;
        case "props":
            triples = await lbdParser.parsePropertyTriples(ifcAPI, modelID);
            break;
        case "fso":
            triples = await lbdParser.parseFSOTriples(ifcAPI, modelID);
            break;
    }
    console.timeEnd("Parsing done");
    document.getElementById("status").innerHTML = "Open console to see results";

    // Print to console
    console.log(triples);

    // Save memory
    ifcAPI.CloseModel(modelID);

}

async function loadInViewer(){

    const ifcURL = URL.createObjectURL(file);

    // Sets up the IFC loading
    const ifcLoader = new IFCLoader();

    await ifcLoader.ifcManager.setWasmPath("./assets/");
    await ifcLoader.ifcManager.applyWebIfcConfig({
        USE_FAST_BOOLS: true
    })

    ifcLoader.ifcManager.setOnProgress = exampleCallback;

    function exampleCallback(event) {
        const progress = event.total / event.progress * 100;
        console.log("Progress: ", progress, "%");
    }

    ifcLoader.load( ifcURL, (ifcModel) => scene.add(ifcModel.mesh));

}

function initScene() {

    //Object to store the size of the viewport
    const size = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    //Creates the camera (point of view of the user)
    const aspect = size.width / size.height;
    const camera = new PerspectiveCamera(75, aspect);
    camera.position.z = 15;
    camera.position.y = 13;
    camera.position.x = 8;

    //Creates the lights of the scene
    const lightColor = 0xffffff;

    const ambientLight = new AmbientLight(lightColor, 0.5);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(lightColor, 1);
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(-5, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    //Sets up the renderer, fetching the canvas of the HTML
    const threeCanvas = document.getElementById("three-canvas");
    const renderer = new WebGLRenderer({
        canvas: threeCanvas,
        alpha: true
    });

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Creates grids and axes in the scene
    const grid = new GridHelper(50, 30);
    scene.add(grid);

    const axes = new AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    scene.add(axes);

    //Creates the orbit controls (to navigate the scene)
    const controls = new OrbitControls(camera, threeCanvas);
    controls.enableDamping = true;
    controls.target.set(-2, 0, 0);

    //Animation loop
    const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    //Adjust the viewport to the size of the browser
    window.addEventListener("resize", () => {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        renderer.setSize(size.width, size.height);
    });

}

function readFile(file) {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader()
  
      // Register event listeners
      reader.addEventListener("loadend", (e) => resolve(e.target.result))
      reader.addEventListener("error", reject)
  
      // Read file
      reader.readAsArrayBuffer(file)
    })
}