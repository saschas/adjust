
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

