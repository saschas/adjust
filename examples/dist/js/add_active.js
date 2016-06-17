
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
  camera.position.set(0,0,200);
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




  //Mouseover Function
  function over (el){

    //console.log(el);
    if(!('oldColor' in el)){
      el.oldColor = el.material.color;
      el.material.color = new THREE.Color(0x000000);
      
    }
    
  }
  //Mouseout Function
  function out (el){
    
    if(('oldColor' in el)){
        el.material.color = el.oldColor;
        delete el.oldColor;
    }

     
    
  }
  //Mousedown Function
  function activeState (el){
    var anim = {};

    el.scale.x = (el.scale.x== 1) ? (anim={
      start :{
        scale: 1,
        rotate : 0
      },end : {
        scale : 1.5,
        rotate : 180
      }
    }) : (anim = {
      start :{
        scale: 1.5,
        rotate : 180
      },end : {
        scale : 1,
        rotate : 0
      }
    });


      new TWEEN.Tween({
        rotate: anim.start.rotate,
        scale : anim.start.scale
      })
      .to({
        rotate: anim.end.rotate,
        scale : anim.end.scale
      }, 1000).easing(TWEEN.Easing.Back.InOut)
      .onUpdate(function() {
        el.rotation.y = (this.rotate) * Math.PI / 180;
        el.scale.set(this.scale,this.scale,this.scale);
        el.updateMatrix();
      }).start();
  }


  //__________ cubes

  var box = new THREE.BoxGeometry( 10,10,10 );

  holder = new THREE.Object3D();
  scene.add(holder);
  var mesh = [];
  for ( var i = 0; i < 500; i ++ ) {

    mesh[i] = new THREE.Mesh( box );
    mesh[i].material = new THREE.MeshLambertMaterial( {color: getRandomColor() } );
    mesh[i].position.x = ( Math.random() - 0.5 ) * 200;
    mesh[i].position.y = ( Math.random() - 0.5 ) * 200;
    mesh[i].position.z = ( Math.random() - 0.5 ) * 200;

    mesh[i].rotation.x = ( Math.random() - 0.5 ) * 2;
    mesh[i].rotation.y = ( Math.random() - 0.5 ) * 2;
    mesh[i].rotation.z = ( Math.random() - 0.5 ) * 2;

    mesh[i].receiveShadow = true;
    mesh[i].castShadow = true;
    mesh[i].name = 'mesh' + i;
    mesh[i].updateMatrix();
    mesh[i].matrixAutoUpdate = false;


    Adjust.addActiveObject( mesh[i] , over,out,activeState,false );

    holder.add( mesh[i] );
  }

}//end of init;


//__________ render
var render = function (time) { 
  requestAnimationFrame( render );
  controls.orbit.update();

  //TWEEN update
  TWEEN.update(time)

  //update Adjust
  Adjust.update();

  holder.rotateY(.001);

  renderer.render(scene, camera);
};

//__________

init();
render(time);



//}()); //__eof

