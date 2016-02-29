var scene,camera,renderer,controls,ambient,spotLight,groundGeo,groundMat,ground,l,cubemap,urls,texture_base;
var main_color,time,canvas_height,canvas_width;
var size,step,screenVertex,count,render;


function init(opt){
  //__________ Variables
  main_color = 0x333333;
  hover_color = 0x666666;
  action_color = 0xFF6347;
  time = 0;
  canvas_height = window.innerHeight * window.devicePixelRatio;
  canvas_width = window.innerWidth * window.devicePixelRatio;

  texture_base = 'assets/skybox/';

    urls = [
      texture_base +"px.png", texture_base +"nx.png",
      texture_base +"py.png", texture_base +"ny.png",
      texture_base +"pz.png", texture_base +"nz.png"
    ];
    
    cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
    cubemap.format = THREE.RGBFormat;
    cubemap.premultiplyAlpha = true;


//__________ Scene
   scene = new THREE.Scene();
    scene.fog = new THREE.Fog(main_color,2000,5000);
//__________ camera
var fov = 50;
if(typeof opt.fov != undefined){
  fov = opt.fov;
}
   camera = new THREE.PerspectiveCamera( fov, canvas_width/canvas_height, 1, 15000 );
  camera.position.set(1500, 1500, 1500);
  scene.add(camera);
//__________ renderer

  renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true
    });
    renderer.setSize( canvas_width, canvas_height );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(main_color,1);

    document.body.appendChild( renderer.domElement );

//__________ resize

window.onresize = function(){
  canvas_height = window.innerHeight;
  canvas_width = window.innerWidth;
  camera.aspect = canvas_width / canvas_height;
  camera.updateProjectionMatrix();
  renderer.setSize( canvas_width, canvas_height );
}

//__________ controls

switch(opt.controls){

  case 'orbit':
    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.2;
    controls.enabled = false;
    controls.maxPolarAngle = 85 * Math.PI/180; 

    camera.position.x = 802;
    camera.position.y = 167;
    camera.position.z = -626;
  break;
  case 'trackball':
    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = true;
    controls.noPan = false;
    controls.enabled = false;
  break;
  default:
    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.2;
    controls.enabled = false;
    controls.maxPolarAngle = 85 * Math.PI/180; 
  break;
}
//__________ light

   ambient = new THREE.AmbientLight(0x333333);
    scene.add(ambient)

     spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( 1000,500,1000);
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = .1;
    spotLight.shadow.camera.far = 10000;
    //spotLight.shadow.bias = -.0018;
  l = 10;
    spotLight.shadow.camera.right     =  l;
    spotLight.shadow.camera.left     =  -l;
    spotLight.shadow.camera.top      =   l;
    spotLight.shadow.camera.bottom   =  -l;

    camera.add(spotLight);
//____________ GROUND
  groundGeo = new THREE.PlaneBufferGeometry(20000,20000,32);
  groundMat = new THREE.MeshPhongMaterial({
      color : main_color,
      envMap : cubemap,
      reflectivity : 0.5,
      shininess : 1
    });

  ground = new THREE.Mesh(groundGeo,groundMat);
  ground.rotation.x = -90 * Math.PI / 180;
  ground.receiveShadow = true;
  scene.add(ground);




  function createPoint(name,index,pos){
  var el = document.createElement('div');  
      el.dataset.x = pos.x;
      el.dataset.y = pos.y;
      el.dataset.z = pos.z;
      el.classList.add(name);
      el.innerHTML = index;
      return el;
}



  // GRID
    size = 1000;
    step = 100;

    gridHelperHorizontal = new THREE.GridHelper( size, step );
    scene.add( gridHelperHorizontal );

  screenVertex = document.createElement('div');
  document.body.appendChild(screenVertex);

  count = 0;
  
  gridHelperHorizontal.geometry.vertices.forEach(function(p,index){
    count++;
  screenVertex.appendChild(createPoint('vertex',index,p));
  if(count == gridHelperHorizontal.geometry.vertices.length-1){
      Adjust.addPoints('vertex');
    }

});



render = function (time) { 
  
  
  //Update Adjust 
  if(typeof opt.tween === 'undefined' || opt.tween){

    TWEEN.update(time);
  }

  Adjust.update();
  
  animation(time);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame( render );
};



window.onresize = function(){
  canvas_height = window.innerHeight * window.devicePixelRatio;
  canvas_width = window.innerWidth * window.devicePixelRatio;


  renderer.setSize( canvas_width, canvas_height );
  camera.aspect =canvas_width/canvas_height;
  camera.updateProjectionMatrix();

  // Adjust Resize
  Adjust.resize();
}







}
// EOF INIT 





//@codekit-prepend '_base.js';
init({
  controls : 'orbit'

});


Adjust.init(camera);


var material = new THREE.LineBasicMaterial({
  color: action_color,
  linewidth : 10,
  fog : false
});


var geometry = new THREE.Geometry();
geometry.vertices.push(
  new THREE.Vector3( -50,250,150 ),
  new THREE.Vector3( -150,150,-250 ),
  new THREE.Vector3( 50,250,-250 )
);

var line = new THREE.Line( geometry, material );
scene.add( line );




 

Adjust.addPoints('point');
function animation(time){
  camera.position.x = Math.sin(0.0005 *time) * 1500;
  camera.position.z = Math.cos(0.0005 *time) * 1500;
  camera.position.y = 150 + Math.max(-Math.sin(0.0005 *time) * 300,Math.sin(0.0005 *time) * 300);

}


//__________ render


render();


//}()); //__eof



