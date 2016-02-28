//@codekit-prepend '_base.js';


init({
  controls : 'orbit',
  fov : 55

});

// INIT Adjust

  controls.enabled = false;

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
  el.material.color = new THREE.Color(0xff0000);
   holder.dataset.activeElement = el.name;
  
}




function createLabel(name,pos){
  var el = document.createElement('div');
      
      el.dataset.label = 'label-' + name;
      //el.dataset.offsetx = 50;
      el.classList.add('label');
      el.innerHTML = '{x:' + pos.x + ',y:'+ pos.y + ',z:' + pos.z + '}';
      return el;
}

var labelBox = new THREE.SphereGeometry(150,32,32);
var Labels = [];
var holder = document.createElement('div');
    holder.classList.add('holder');



for ( var i = 0; i < 50; i ++ ) {
// A new Mesh with the same geometry and material
    Labels[i] = new THREE.Mesh( labelBox , new THREE.MeshPhongMaterial(0xffffff) );
  // with a random position
    
    Labels[i]._origin = {
      x : Adjust.randNum(0,1000,true),
      y : Adjust.randNum(50,500,false),
      z : Adjust.randNum(0,1000,true),
    } 

    Labels[i].position.x = Labels[i]._origin.x;
    Labels[i].position.y = Labels[i]._origin.y;
    Labels[i].position.z = Labels[i]._origin.z;


    Labels[i]._fac = {
      x : Adjust.randNum(0.1,1.75,false),
      y : Adjust.randNum(0.1,1.75,false),
      z : Adjust.randNum(0.1,1.75,false)
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
        x : -Adjust.randNum(10,50,false),
        y : -Adjust.randNum(10,50,false),
        z : -Adjust.randNum(10,50,false)
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


      if(Adjust.selected === this){
       // console.log('match');

        this._origin.x = this.position.x;
        this._origin.y = this.position.y;
        this._origin.z = this.position.z;

      }else{
        this.position.x = this._origin.x + this._off.x;
        this.position.y = this._origin.y + this._off.y;
        this.position.z = this._origin.z + this._off.z;
      }

    }

    
    Adjust.addActiveObject(Labels[i],over,out,activeState,true);
    

    holder.appendChild(createLabel(i,Labels[i].position));
    
    scene.add( Labels[i]);
}
document.body.appendChild(holder);


Adjust.addLabel('label');


//__________ animation

function animation(time){

  Labels.forEach(function(p,index){
    p.update(time);
  });

  for(var i=0;i<holder.childNodes.length;i++){
    holder.childNodes[i].innerHTML = '<span class="highlight">label '+ i + '</span> {x:' + Math.ceil(Labels[i].position.x) + ',y:'+ Math.ceil(Labels[i].position.y)  + ',z:' + Math.ceil(Labels[i].position.z)  + '}';
  }
 
  
  camera.position.x = controls.target.x + Math.sin(0.00005 *time) * 1500;
  camera.position.z = controls.target.z + Math.cos(0.00005 *time) * 1500;
  camera.position.y = controls.target.y + 1500 + Math.max(-Math.sin(0.0005 *time) * 300,Math.sin(0.0005 *time) * 300);

}


render();


//}()); //__eof

