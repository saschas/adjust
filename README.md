## Adjust.js

- [init()](#user-content-init)
- [addLabel()](#user-content-addlabel)
- [addPoints()](#user-content-trackelements)
- [removePoints()](#user-content-untrackelements)
- [addActiveObject()](#user-content-addactiveobject)

### Installation
Load the Library.
```html
<script src="adjust.min.js"></script>
```


### .init()
Init Adjust with a threejs camera as argument.
```js
Adjust.init(camera);
```
### .resize();
Resize Adjust
```js
window.onresize = function(){
    Adjust.resize();
}
```
### .update(camera);
Update Adjust on each frame

```js
function render(t) { 
  Adjust.update();
  
  renderer.render(scene, camera);
  requestAnimationFrame( render );
};

```

# Methods

---

### .addLabel();
Add a label to a threejs Mesh. Label has a data-Attribute data-bound="bool". Attribute is __true__ if in Frustum, __false__ if not.
*NOTE: Mesh must be added directly to scene. Cannot be a child of other Elements*

<a href="http://htmlpreview.github.io/?https://github.com/saschas/adjust/blob/master/examples/add_label.html">view demo</a>
#####html
```html
<div class="label" data-label="box">
    <!--Your content-->
</div>
```
#####js - threejs
```js
var boxGeometry = new THREE.BoxGeometry(10,10,10);
var boxMaterial = new THREE.MeshBasicMaterial(0xcccccc);
var box = new THREE.Mesh(boxGeometry,boxMaterial);

    box.name = "box"; // same name as data-label
    scene.add(box);

    // Init Labels by Classname
    Adjust.addLabel('label');
```

---

### .addPoints()
Place div in Space: <a href="http://htmlpreview.github.io/?https://github.com/saschas/adjust/blob/master/examples/add_points.html">view demo</a>

__Data Attritbutes are required!__
#####html
```html
<div class="point" data-x="45" data-y="150" data-z="-500">
    <!--Your content-->
</div>
```

#####js
```js
Adjust.addPoints('point');
```
#####css
```css
.point{
    top: 0;
    left: 0;
    z-index: 1;
    transform-origin: 0 0;
    display: inline-block;
    position: absolute;
}
```

---

###.removePoints();
Untrack all Elements! Not labels

---

###.addActiveObject()

<a href="http://htmlpreview.github.io/?https://github.com/saschas/adjust/blob/master/examples/add_active.html">view demo</a>
<a href="http://htmlpreview.github.io/?https://github.com/saschas/adjust/blob/master/examples/add_active_draggable.html">view draggable demo</a>

| argument | type |
|---|---|
| element | mesh |
| mouseover | function(activeObject) |
| mouseleave | function(activeObject) |
| mousedown | function(activeObject) |
| draggable | bool |

```js

// Box
var boxGeometry = new THREE.BoxGeometry(10,10,10);
var boxMaterial = new THREE.MeshBasicMaterial(0xcccccc);
var box = new THREE.Mesh(boxGeometry,boxMaterial);

    box.name = "box"; // same name as data-label
    scene.add(box);

// States

//Mouseover Function
function over (el){
  el.material.color = new THREE.Color(0x000000);
}
//Mouseout Function
function out (el){
  el.material.color = new THREE.Color(0xffffff);
}
//Mousedown Function
function activeState (el){
    el.material.color = new THREE.Color(0xff0000);
}

//Add Object to activeObjects
Adjust.addActiveObject(box,over,out,activeState,false);
```


## Helper Methods


#### .distanceToCamera(vector3)
returns distance to Camera
#### .objInFrustum(obj)
returns bool
#### .pointInFrustum(vector3)
returns bool

#### .checkPointInRadius(origin,target,radius)
    return Array [boolean , distance ]

origin - object - {x:0,y:0,z:0}
target - object - {x:0,y:0,z:0}
radius - number - 10






