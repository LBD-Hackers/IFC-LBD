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
import { LBDParser, ParserSettings } from "../../dist/index.js";
import { IfcAPI } from "web-ifc";

//Creates the Three.js scene
const scene = new Scene();
let arrayBuffer;

initScene();

// Event: Upload file
const input = document.getElementById("file-input");
  input.addEventListener(
    "change",
    async (changed) => {

      // Get file
      const file = changed.target.files[0];

      // Hide file uoload
      document.getElementById("get_file").style.display = "none";

      // Load in viewer
      document.getElementById("status").innerHTML = "Loading model in scene + building array buffer...";
      const [v, ab] = await Promise.all([
        loadInViewer(file),
        readFile(file)
      ]);
      arrayBuffer = ab;
      document.getElementById("status").innerHTML = "";

      // Unhide parsing options
      document.getElementById("parsers").style.display = "block";

    },
    false
);

// Event: Do parse
document.getElementById("run").addEventListener("click", () => parseTriples());

async function parseTriples(){

    document.getElementById("status").innerHTML = "Loading IFC API...";

    const ifcAPI = new IfcAPI();
    ifcAPI.SetWasmPath("./assets/");
    await ifcAPI.Init();
    const modelID = ifcAPI.OpenModel(new Uint8Array(arrayBuffer));

    // Define parser settings
    const settings = new ParserSettings();
    settings.outputFormat = document.getElementById('serialization').value;
    settings.namespace = document.getElementById('baseURI').value;
    settings.subsets.BOT = document.getElementById('bot-subset').checked;
    settings.subsets.PRODUCTS = document.getElementById('products-subset').checked;
    settings.subsets.PROPERTIES = document.getElementById('properties-subset').checked;
    settings.subsets.FSO = document.getElementById('fso-subset').checked;

    document.getElementById("status").innerHTML = "Parsing LBD triples...";

    // Run parser
    const lbdParser = new LBDParser(settings);
    const triples = await lbdParser.parse(ifcAPI, modelID);

    document.getElementById("status").innerHTML = "Results ready!";

    // Release memory
    ifcAPI.CloseModel(modelID);

    // Hide parsing options
    document.getElementById("parsers").style.display = "none";

    // Show download button
    document.getElementById("download-results").style.display = "block";

    document.getElementById("download-results").addEventListener("click", () => downloadResults(triples, settings.outputFormat));

}

async function loadInViewer(file){

    document.getElementById("status").innerHTML = "Loading model (user interface is blocked in the meantime)...";

    return new Promise(async (resolve) => {

        const ifcURL = URL.createObjectURL(file);

        // Sets up the IFC loading
        const ifcLoader = new IFCLoader();

        await ifcLoader.ifcManager.setWasmPath("./assets/");
        await ifcLoader.ifcManager.applyWebIfcConfig({
            USE_FAST_BOOLS: true,
            COORDINATE_TO_ORIGIN: false
        })

        ifcLoader.ifcManager.setOnProgress = exampleCallback;

        function exampleCallback(event) {
            const progress = event.total / event.progress * 100;
            console.log("Progress: ", progress, "%");
        }

        ifcLoader.load( ifcURL, (ifcModel) => {
            scene.add(ifcModel.mesh);
            document.getElementById("status").innerHTML = "";
            resolve();
        });

    })

}

async function downloadResults(triples, serialization){

    const fileType = serialization == "jsonld" ? "application/ld+json" : "application/n-quads"; 
    const fileName = serialization == "jsonld" ? "lbd.json" : "lbd.nq"; 

    var blob = new Blob([triples], { type: fileType });

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);

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