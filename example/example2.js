var scene,camera,renderer,controls,ambient,spotLight,groundGeo,groundMat,ground,l,cubemap,urls,texture_base;
var main_color,time,canvas_height,canvas_width;
var size,step,screenVertex,count,render;


function init(opt){
  //__________ Variables
  main_color = 0x666666;
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
    scene.fog = new THREE.Fog(main_color,1000,3000);
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
    controls.enabled = true;
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
    controls.enabled = true;
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
    spotLight.shadow.camera.far = 3000;
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
      Adjust.trackElements('vertex');
    }

});



render = function (time) { 
  
  
  //Update Adjust 
  if(typeof opt.tween === 'undefined' || opt.tween){

    TWEEN.update(time);
  }

  Adjust.update(camera);
  
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
  controls : 'orbit',
  fov : 55

});

// INIT Adjust


Adjust.init();


function over (el){
  el.material.color = new THREE.Color(0x000000);
  holder.dataset.activeElement = el.name;
}
function out (el){
  el.material.color = new THREE.Color(0xffffff);
   holder.dataset.activeElement = '';
}

function activeState (el){

  // new TWEEN.Tween(camera.position).to({ 
  //     x: el.position.x + 150, 
  //     y: el.position.y + 150,
  //     z: el.position.z + 150
  //   }, 1000).start();

  new TWEEN.Tween(controls.target).to({ 
      x: el.position.x, 
      y: el.position.y,
      z: el.position.z
    }, 1500).easing(TWEEN.Easing.Quadratic.Out).start();
  el.material.color = new THREE.Color(0xff0000);
   holder.dataset.activeElement = el.name;
}




function createLabel(name,pos){
  var el = document.createElement('div');
      
      el.dataset.label = 'label-' + name;
      el.dataset.offsety =0;
      el.classList.add('label');
      el.innerHTML = '<span class="highlight">label:'+name+'</span>';
      return el;
}





var labelBox = new THREE.BoxGeometry(195,Adjust.randNum(130,190,false),195);
var Labels = [];
var holder = document.createElement('div');
    holder.classList.add('holder');


var col = 0;
var row = 0;

for ( var i = 0; i < 81; i ++ ) {
// A new Mesh with the same geometry and material
    Labels[i] = new THREE.Mesh( new THREE.BoxGeometry(55,Adjust.randNum(130,190,false),55) , new THREE.MeshPhongMaterial(0xffffff) );
  // with a random position
    
    Labels[i]._origin = {
      x : -800 + (row * 200),
      y : 0,
      z : 800 - col * 200,
    } 
    row++;
    if(row > 8){
      row = 0;
      col ++;
    }
    Labels[i].position.x = Labels[i]._origin.x;
    Labels[i].position.y = Labels[i]._origin.y;
    Labels[i].position.z = Labels[i]._origin.z;


    Labels[i]._fac = {
      x : Adjust.randNum(0.5,1.5,false),
      y : 0,
      z : Adjust.randNum(0.5,1.5,false)
    } 
    Labels[i]._dir = {
      x : 1,
      y : 1,
      z : 1
    }
    Labels[i]._off = {
      x : 0,
      y : 0,
      z : 0
    } 
    Labels[i]._dist = {
      min:{
        x : -Adjust.randNum(0,1,false),
        y : -Adjust.randNum(0,1,false),
        z : -Adjust.randNum(0,1,false)
      },
      max:{
        x : Adjust.randNum(10,100,false),
        y : Adjust.randNum(10,100,false),
        z : Adjust.randNum(10,100,false)
      }
    } 

    Labels[i].name = 'label-' + i;



    Labels[i].update = function(time){

      if(this._off.x < this._dist.min.x || this._off.x > this._dist.max.x){
        this._dir.x *= (-1);
      }
      this._off.x += this._fac.x * this._dir.x;

      if(this._off.y < this._dist.min.y || this._off.y > this._dist.max.y){
        this._dir.y *= (-1);
      }
      this._off.y += this._fac.y * this._dir.y;

       if(this._off.z < this._dist.min.z || this._off.z > this._dist.max.z){
        this._dir.z *= (-1);
      }
      this._off.z += this._fac.z * this._dir.z;


  
         this.position.x = this._origin.x + this._off.x;
         this.position.y = this._origin.y + this._off.y;
         this.position.z = this._origin.z + this._off.z;
      
    }
    Adjust.addActiveObject(Labels[i],over,out,activeState,false);
    holder.appendChild(createLabel(i,Labels[i].position));
    
    scene.add( Labels[i]);
}
document.body.appendChild(holder);


Adjust.addLabel('label');


//__________ render


function animation(time){

  Labels.forEach(function(p,index){
    p.update(time);
  });

  camera.position.x = controls.target.x + Math.sin(0.00005 *time) * 1500;
  camera.position.z = controls.target.z + Math.cos(0.00005 *time) * 1500;
  camera.position.y = controls.target.y + 1500 + Math.max(-Math.sin(0.0005 *time) * 300,Math.sin(0.0005 *time) * 300);

  
}


render();


//}()); //__eof



