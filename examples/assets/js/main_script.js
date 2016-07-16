
/*
	Basic Setup
*/
//(function(){

//__________ Variables

var main_color = 0xffffff;

var canvas_height, canvas_width;
var renderer;
var scene, controls, camera , effect;

var controls = {
  type : 'orbit',
  orbit :null
}

//__________ Create VR Button

function init(){
  
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  //__________ scene
  scene = new THREE.Scene();

  //__________ camera
  camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );

  camera.position.set(0,50,200);
  camera.lookAt(new THREE.Vector3(0,50,0));
  scene.add(camera);
  //__________ renderer

  renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize( canvas_width, canvas_height );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(main_color,1);

  document.body.appendChild( renderer.domElement );

  //__________ Controls


  //____ Orbit

  controls.orbit = new THREE.OrbitControls( camera );
  controls.orbit.damping = 0.2;
  //controls.orbit.maxPolarAngle = Math.PI/2;
  //controls.orbit.minPolarAngle = 1;
  //controls.orbit.minDistance = 100;
  //controls.orbit.maxDistance = 220;


  //__________ resize

  window.onresize = function(){
    canvas_height = window.innerHeight;
    canvas_width = window.innerWidth;
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();

    renderer.setSize( canvas_width, canvas_height );
   // effect.setSize(canvas_width, canvas_height);
  }  


  //__________ light

  var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set( 0, 100, 100 );
      spotLight.intensity = 1;
      spotLight.castShadow = true;
      scene.add(spotLight);

  //__________ cubes

  var base_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
  var box = new THREE.BoxGeometry( 5, 5, 5 );

  for ( var i = 0; i < 50; i ++ ) {
    var mesh = new THREE.Mesh( box , base_material );
        mesh.position.x = ( Math.random() - 0.5 ) * 500;
        mesh.position.y = ( Math.random() - 0.5 ) * 500;
        mesh.position.z = ( Math.random() - 0.5 ) * 500;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add( mesh );
  }

}//end of init;


//__________ render
var render = function () { 
  requestAnimationFrame( render ); 
  animation();

  controls.orbit.update();
  renderer.render(scene, camera);
  
 
};

//__________ animation

function animation(){
  // scene.rotation.y  -= .0005;
};

//__________

init();
render();



//}()); //__eof

