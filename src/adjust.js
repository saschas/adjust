var Adjust = {
	version : 0.01,
  dpr : window.devicePixelRatio,
  width : window.innerWidth * this.dpr,
  height : window.innerHeight * this.dpr,
  realWidth : window.innerWidth,
  realHeight : window.innerHeight,
  mouse : new THREE.Vector2(),
  offset : new THREE.Vector3(),
  objects : [],
  half :  {
    width : 0.5  * this.width / this.dpr,
    height : 0.5  * this.height / this.dpr
  },
  raycaster : new THREE.Raycaster(),
  selected : null,
  intersected :null,
  labels : []
}

Adjust.init = function(){

  this.bindEvents();
  this.resize();
  this.plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 200, 200, 8, 8 ),
    new THREE.MeshPhongMaterial( { visible: false } )
  );
  scene.add( this.plane );
}

Adjust.bindEvents = function(){
  window.addEventListener( 'mousemove', this.onMouseMove, false );
  window.addEventListener( 'mousedown', this.onMouseDown, false );
  window.addEventListener( 'mouseup', this.onMouseUp, false );
}

Adjust.randNum = function(min,max,bool){
  var num = Math.floor(Math.random()*max) + min;
  if(bool || typeof bool == "undefined"){
num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
  }
  return num;
}


Adjust.trackElements = function (elements){
  if(typeof this.elements == 'object'){
    var additionalElements = document.getElementsByClassName(elements);
    var moreObjects = [];
    this.domElementsBool = true;
    for(var i = 0;i<this.elements.length;i++){
        moreObjects.push(this.elements[i]);
    }
    for(var el = 0;el<additionalElements.length;el++){
        moreObjects.push(additionalElements[el]);
    }
    
    this.elements = moreObjects;

  }else{
    if(typeof elements != "undefined"){
        this.elements = document.getElementsByClassName(elements);
  
      this.domElementsBool = true;
    }
    else{
      console.warn('No argument! classname required');
    }
  }
}

Adjust.untrackElements = function (){
  this.domElementsBool = false;

  for(var p=0;p< this.elements.length;p++){
    this.elements[p].style = '';
  }
  this.elements = [];
}



Adjust.addLabel = function (className) {

  this.updateLabelsBool = true;
  var labels = document.getElementsByClassName(className);

  for(var i=0; i < labels.length;i++){
    this.labels.push(labels[i]);

    scene.children.forEach(function(l,index){

      if(l.name == labels[i].dataset.label){
        labels[i]._dirtyCustom = l;
      }

    })
  }
}

Adjust.updateSingleLabel = function(domElement,camera){
var offsetX = 0;
var offsetY = 0;

  if(typeof domElement.dataset.offsetx != 'undefined'){
    offsetX = domElement.dataset.offsetx;
  }
  if(typeof domElement.dataset.offsety != 'undefined'){
    offsetY = domElement.dataset.offsety;
  }
  var vector = new THREE.Vector3();
  var p = {
    x : parseFloat(domElement._dirtyCustom.position.x) - offsetX,
    y : parseFloat(domElement._dirtyCustom.position.y) - offsetY,
    z : parseFloat(domElement._dirtyCustom.position.z),
  }
  vector.set(p.x,p.y,p.z);

  this.convertVector(vector,camera);

  this.domElement(domElement,vector);
  return vector;
}

Adjust.resize = function (){
	this.dpr = window.devicePixelRatio,
  this.width = window.innerWidth * this.dpr,
  this.height = window.innerHeight * this.dpr,
  this.realWidth = window.innerWidth,
  this.realHeight = window.innerHeight,
  this.half.width = 0.5  * this.width / this.dpr;
  this.half.height = 0.5  * this.height / this.dpr
}

Adjust.domElement = function (domElement,vector,bound){
  var offsetX = domElement.getBoundingClientRect().width / 2;
	var offsetY = domElement.getBoundingClientRect().height / 2;
  vector.x -= offsetX;
	vector.y -= offsetY;
  vector.z = Math.max((3) - vector.z , 0.1);

  domElement.style.webkitTransform = 'translateX(' + vector.x +'px) translateY('+vector.y + 'px) translateZ('+vector.z + 'px)';
  domElement.style.MozTransform = 'translateX(' + vector.x +'px) translateY('+vector.y + 'px) translateZ('+vector.z + 'px)';
  domElement.style.OTransform = 'translateX(' + vector.x +'px) translateY('+vector.y + 'px) translateZ('+vector.z + 'px)';
  domElement.style.transform = 'translateX(' + vector.x +'px) translateY('+vector.y + 'px) translateZ('+vector.z + 'px)';
  
  if(typeof bound != 'undefined'){
    domElement.dataset.bound = bound;
  }
}

Adjust.convertVector = function (v,c){
	v.project(c);
	v.x = ( v.x * this.half.width) + this.half.width;
	v.y = - ( v.y * this.half.height ) + this.half.height;
	v.z = ( v.z * (this.half.width/this.half.height) / 2) + (this.half.width / this.half.height) * 2;//(((v.x - c.position.x) * (v.x - c.position.x)) + ((v.y - c.position.y) * (v.y - c.position.y)) + ((v.z - c.position.z) * (v.z - c.position.z))) / ((this.width / this.height) * 2) / 1000000 ;
		  
	return v;
}

Adjust.element = function (domElement,camera){
  var vector = new THREE.Vector3();

  if(typeof this.width == "undefined"){
  	this.init();
  }
  if(Object.keys(domElement.dataset).length == 0){
  	console.warn('Missing data Attribute on Element:',domElement);
  	return false;
  }
  var p = {
    x : parseFloat(domElement.dataset.x),
    y : parseFloat(domElement.dataset.y),
    z : parseFloat(domElement.dataset.z),
  }
  vector.set(p.x,p.y,p.z);

  this.convertVector(vector,camera);
  this.domElement(domElement,vector);
  return vector;
}

Adjust.setMouse = function(coor){
  
  this.mouse = coor;

  return this.mouse;
}

Adjust.normalizeMouse = function(coor){


  var vec = {
    x : (coor.x / this.width) * 2 - 1,
    y : (coor.y / this.height) * 2 + 1,
    z : 0.5
  }
  
  return vec;
}


Adjust.onMouseMove = function( event ) {


  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  Adjust.setMouse({
    x : event.clientX,
    y : event.clientY,
    z : 0.5
  });


}

Adjust.checkSelected = function (){
  if(this.intersected!=null){
    this.selected = this.intersected;
    this.selectedState(this.intersected);
  }
  else{
    this.selected = null;
  }
 
}
Adjust.uncheckSelected = function (){
  if (this.intersected ) {
    if(typeof this.passivState != 'undefined'){
      this.passivState(this.intersected);
    }
    if(this.intersected._draggable){
      this.plane.position.copy( this.intersected.position );
    }
  }
  this.intersected = null;
  this.selected = null;
}

Adjust.onMouseDown = function (event){
  Adjust.checkSelected();
}


Adjust.onMouseUp = function (event){
  Adjust.uncheckSelected();

}

Adjust.checkPointInRadius = function(point,target, radius,cb) {
  var distsq = (point.x - target.x) * (point.x - target.x) + (point.y - target.y) * (point.y - target.y) + (point.z - target.z) * (point.z - target.z);
  // returns bool , distance to target origin


  var sum = [distsq <= radius * radius * radius,distsq];


  cb(sum[0],sum[1]);

  return sum;
}


Adjust.update = function(camera){

  if(this.domElementsBool){
    for(var p=0;p< this.elements.length;p++){
      this.element(this.elements[p],camera);
    }
  }

  if(this.updateLabelsBool){
    for(var l=0;l< this.labels.length;l++){
      this.updateSingleLabel(this.labels[l],camera);
    }
  }

  if(this.activeObjectUpdate){
    this.checkMouseCollision(camera);
  }

}

Adjust.addActiveObject = function (obj,activState,passivState,selectedState,bool){
  this.activState = activState;
  this.passivState = passivState;
  this.selectedState = selectedState;
  this.activeObjectUpdate = true;
  this.objects.push(obj);

  this.addDraggable(obj,bool);
}


Adjust.addDraggable = function(obj,bool){
  obj._draggable = bool;
}


Adjust.checkMouseCollision = function(camera){
  var vector = new THREE.Vector3();

  vector.set(
      ( this.mouse.x / this.realWidth ) * 2 - 1,
      - ( this.mouse.y / this.realHeight ) * 2 + 1,
      0.5 );


  this.raycaster.setFromCamera( vector, camera );

   if ( this.selected !=null) {
    this.intersects = this.raycaster.intersectObject( this.plane );

          if ( this.intersects.length > 0 ) {
              this.plane.position.copy( this.intersected.position );
              this.plane.lookAt( camera.position );

            
            if(this.intersected._draggable){

              this.selected.position.copy( this.intersects[ 0 ].point.sub( this.offset ) );
              
            }
          }
    return;
  }

  this.intersects = this.raycaster.intersectObjects( this.objects );

  if ( this.intersects.length > 0 ) {
    
    if ( this.intersected != this.intersects[ 0 ].object ) {
      if ( this.intersected ) {
        this.passivState(this.intersected);
      }

        this.intersected = this.intersects[ 0 ].object;
       
        this.plane.position.copy( this.intersected.position );
        this.plane.lookAt( camera.position );
    }

    if ( this.intersected ) {
      this.activState(this.intersected);
    }
  } else {

    if ( this.intersected ) {
    
      this.passivState(this.intersected);
    }

    this.intersected = null;
    this.selected = null;

  }
}

Adjust.mouseToSpace = function(camera){

  var vector = new THREE.Vector3();

  vector.set(
      ( this.mouse.x / this.realWidth ) * 2 - 1,
      - ( this.mouse.y / this.realHeight ) * 2 + 1,
      0.5 );

  vector.unproject( camera );

  var dir = vector.sub( camera.position ).normalize();

  var distance = - camera.position.y / dir.y;

  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

  return pos;
}
