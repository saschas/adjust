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

