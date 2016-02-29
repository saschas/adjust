//@codekit-prepend '_base.js';
init({
  controls : 'trackball',
  fov : 85,
  tween : false
});


// INIT Adjust


Adjust.init(camera);




function createLabel(name,pos){
  var el = document.createElement('div');
      
      el.dataset.label = 'label-' + name;
      el.classList.add('label');
      el.innerHTML = 'label ' + name;
      return el;
}




var labelBox = new THREE.SphereGeometry(45,32,32);
var Labels = [];
var labelHolder = document.createElement('div');
    labelHolder.classList.add('labelholder');



for ( var i = 0; i < 50; i ++ ) {

    Labels[i] = new THREE.Mesh( labelBox , new THREE.MeshPhongMaterial({
      color : 0x0E4075,
      envMap : cubemap,
      reflectivity : 0.5,
      shininess : 1,
      specular : new THREE.Color(0x26C0EE)
    }) );
    Labels[i].position.x = Adjust.randNum(50,700,true);
    Labels[i].position.y = Adjust.randNum(50,350,false);
    Labels[i].position.z = Adjust.randNum(50,700,true);

    Labels[i].name = 'label-' + i;
    Labels[i].castShadow = true;
    Labels[i].receiveShadow = true;

    labelHolder.appendChild(createLabel(i,Labels[i].position));
    
    scene.add( Labels[i]);
}
document.body.appendChild(labelHolder);


Adjust.addLabel('label');





//__________ Animation


function animation(time){


  camera.position.x = Math.sin(0.00005 *time) * 500;
  camera.position.z = Math.cos(0.00005 *time) * 500;
  camera.position.y = 250 + Math.max(-Math.sin(0.0005 *time) * 100,Math.sin(0.0005 *time) * 100);

}


render();


//}()); //__eof

