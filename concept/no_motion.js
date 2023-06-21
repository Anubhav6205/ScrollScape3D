import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import gsap from "gsap";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//raycaster part 2
const raycaster = new THREE.Raycaster();

//GUI
const gui = new dat.GUI();

const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegment: 10,
    heightSegment: 10
  }
};

//world.plane is path for object
//width is the element that needs to be changed
//1 and 20 are min and max values
//discarding previous geometry of mesh
//adding new geometry

const handleGUI = () => {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegment,
    world.plane.heightSegment
  );
  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    array[i + 2] = z + Math.random();
  }


  //ensuring that new plane has vertex attribute 'colors'
  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0.0, 0.15, 0.32);
  }
  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
};

//we can change the world.plane values using this
gui.add(world.plane, "width", 1, 20).onChange(handleGUI);

gui.add(world.plane, "height", 1, 20).onChange(handleGUI);

gui.add(world.plane, "widthSegment", 1, 20).onChange(handleGUI);

gui.add(world.plane, "heightSegment", 1, 20).onChange(handleGUI);

//moving camera backwards so we can see the plane
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//appening the renders domElement to body of html document
document.body.appendChild(renderer.domElement);

//orbit controls
new OrbitControls(camera, renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(16, 9, 20, 12);

//00 is red ff is green 00 is blue
//three.DoubleSide makes the plane visible on both sides on rotation

const planeMaterial = new THREE.MeshStandardMaterial({
  //color attribute is causing issue after adding vertex colors
  // color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: true, // Enable flat shading
  //to add hover effect
  vertexColors: true,
  roughness:0.5, // Controls the smoothness of the material surface
  metalness: 0.5 // Controls the metal-like appearance of the material
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

//adding new  float 32buffer attribute
//'color' is name of attribute getting added
//new THREE.BufferAttribute shows type of attribute
//last three shows the grouping position ( 3 data values show one position)
//the three 3's are the R.G.B values from 0 to 1

//since we need to add 0 0 1 for all the vertex (similar size to position attribute). we will create an array with those values and pass it
const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0.0, 0.15, 0.32);
}
planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

//0xffffff is white light , 1 is light intensity
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

//adding light at back of plane

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

//destructuring array out of the path
const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];
  array[i + 2] = z + Math.random();
}

const mouse = {
  x: undefined,
  y: undefined
};

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const animate = () => {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    //face in intersects[0] represents group of datapoints we are hovering over
    //changing the color for groups of vertices a,b,c that form the part we hover over
    //for vertex 1 , we are changing X property only

    //Vertex 1
    intersects[0].object.geometry.attributes.color.setX(
      intersects[0].face.a,
      0.1
    );
    intersects[0].object.geometry.attributes.color.setY(
      intersects[0].face.a,
      0.5
    );
    intersects[0].object.geometry.attributes.color.setZ(
      intersects[0].face.a,
      0.5
    );

    //Vertex 2
    intersects[0].object.geometry.attributes.color.setX(
      intersects[0].face.b,
      0.1
    );
    intersects[0].object.geometry.attributes.color.setY(
      intersects[0].face.b,
      0.5
    );
    intersects[0].object.geometry.attributes.color.setZ(
      intersects[0].face.b,
      0.5
    );

    //Vertex 3
    intersects[0].object.geometry.attributes.color.setX(
      intersects[0].face.c,
      0.1
    );
    intersects[0].object.geometry.attributes.color.setY(
      intersects[0].face.c,
      0.5
    );
    intersects[0].object.geometry.attributes.color.setZ(
      intersects[0].face.c,
      0.5
    );

    intersects[0].object.geometry.attributes.color.needsUpdate = true;

    const initalColors = {
      r: 0.0,
      g: 0.3,
      b: 0.4
    };

    const hoverColors = {
      r: 0.2,
      g: 1.2,
      b: 1.6
    };

    //selecting hoverColors
    gsap.to(hoverColors, {
      r: initalColors.r,
      g: initalColors.g,
      b: initalColors.b,
      onUpdate: () => {
        intersects[0].object.geometry.attributes.color.setX(
          intersects[0].face.a,
          hoverColors.r
        );
        intersects[0].object.geometry.attributes.color.setY(
          intersects[0].face.a,
          hoverColors.g
        );
        intersects[0].object.geometry.attributes.color.setZ(
          intersects[0].face.a,
          hoverColors.b
        );

        intersects[0].object.geometry.attributes.color.setX(
          intersects[0].face.b,
          hoverColors.r
        );
        intersects[0].object.geometry.attributes.color.setY(
          intersects[0].face.b,
          hoverColors.g
        );
        intersects[0].object.geometry.attributes.color.setZ(
          intersects[0].face.b,
          hoverColors.b
        );

        intersects[0].object.geometry.attributes.color.setX(
          intersects[0].face.c,
          hoverColors.r
        );
        intersects[0].object.geometry.attributes.color.setY(
          intersects[0].face.c,
          hoverColors.g
        );
        intersects[0].object.geometry.attributes.color.setZ(
          intersects[0].face.c,
          hoverColors.b
        );

        intersects[0].object.geometry.attributes.color.needsUpdate = true;
      }
    });
  }
};

animate();

renderer.render(scene, camera);
