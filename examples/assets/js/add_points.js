
/*
	Basic Setup
*/
//(function(){

//__________ Variables

var main_color = 0xffffff;
var holder;
var time = 0;
var canvas_height, canvas_width;
var renderer;
var scene, controls, camera , effect;

var controls = {
  type : 'orbit',
  orbit :null
}


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//__________ Create VR Button

function init(){
  
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  //__________ scene
  scene = new THREE.Scene();
  //__________ camera
  camera = new THREE.PerspectiveCamera( 55, canvas_width/canvas_height, 0.1, 1000 );
  camera.position.set(200,200,200);
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

   //____ Orbit

  controls.orbit = new THREE.OrbitControls( camera );
  controls.orbit.damping = 0.2;

  //__________ resize

  window.onresize = function(){
    canvas_height = window.innerHeight;
    canvas_width = window.innerWidth;
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();

    renderer.setSize( canvas_width, canvas_height );
  }  
  //__________ light

  var ambient = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambient);

  var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set( 0, 200, 0 );
      spotLight.intensity = 1;
      spotLight.castShadow = true;
      scene.add(spotLight);

  //__________ Init Adjust

  Adjust.init({
    scene : scene,
    camera : camera,
    renderer : renderer
  });

  //__________ Create Grid

    var size = 300;
    var step = 10;

    var gridHelper = new THREE.GridHelper( size, step );
    scene.add( gridHelper );

  //__________ Create Label

  function createPoint(pos) {

    var pointElement = document.createElement('div');
        pointElement.dataset.x = pos.x;
        pointElement.dataset.y = pos.y;
        pointElement.dataset.z = pos.z;
        pointElement.className = 'point';
        pointElement.innerHTML = 'point at position x:' + Math.round(pos.x) + ',y:' + Math.round(pos.y) + ',z:' + Math.round(pos.z) ;

        document.body.appendChild(pointElement);
  }


  for(var i=0;i<10;i++){
    createPoint({
      x : ( Math.random() - 0.5 ) * 200,
      y : ( Math.random() - 0.5 ) * 200,
      z : ( Math.random() - 0.5 ) * 200
    });
  }


//track all points
Adjust.addPoints('point');

}
//__________ render
var render = function (time) { 
  requestAnimationFrame( render );
  controls.orbit.update();

  //update Adjust
  Adjust.update();

  renderer.render(scene, camera);
};

//__________

init();
render(time);



//}()); //__eof

