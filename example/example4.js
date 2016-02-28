function init(e){function a(e,a,t){var n=document.createElement("div");return n.dataset.x=t.x,n.dataset.y=t.y,n.dataset.z=t.z,n.classList.add(e),n.innerHTML=a,n}main_color=6710886,hover_color=6710886,action_color=16737095,time=0,canvas_height=window.innerHeight*window.devicePixelRatio,canvas_width=window.innerWidth*window.devicePixelRatio,texture_base="assets/skybox/",urls=[texture_base+"px.png",texture_base+"nx.png",texture_base+"py.png",texture_base+"ny.png",texture_base+"pz.png",texture_base+"nz.png"],cubemap=THREE.ImageUtils.loadTextureCube(urls),cubemap.format=THREE.RGBFormat,cubemap.premultiplyAlpha=!0,scene=new THREE.Scene,scene.fog=new THREE.Fog(main_color,1e3,3e3);var t=50;switch(void 0!=typeof e.fov&&(t=e.fov),camera=new THREE.PerspectiveCamera(t,canvas_width/canvas_height,1,15e3),camera.position.set(1500,1500,1500),scene.add(camera),renderer=new THREE.WebGLRenderer({alpha:!0,antialias:!0}),renderer.setSize(canvas_width,canvas_height),renderer.shadowMap.enabled=!0,renderer.shadowMap.type=THREE.PCFSoftShadowMap,renderer.setClearColor(main_color,1),document.body.appendChild(renderer.domElement),window.onresize=function(){canvas_height=window.innerHeight,canvas_width=window.innerWidth,camera.aspect=canvas_width/canvas_height,camera.updateProjectionMatrix(),renderer.setSize(canvas_width,canvas_height)},e.controls){case"orbit":controls=new THREE.OrbitControls(camera),controls.damping=.2,controls.enabled=!0,controls.maxPolarAngle=85*Math.PI/180,camera.position.x=802,camera.position.y=167,camera.position.z=-626;break;case"trackball":controls=new THREE.TrackballControls(camera),controls.rotateSpeed=1,controls.zoomSpeed=1.2,controls.panSpeed=.8,controls.noZoom=!0,controls.noPan=!1,controls.enabled=!1;break;default:controls=new THREE.OrbitControls(camera),controls.damping=.2,controls.enabled=!0,controls.maxPolarAngle=85*Math.PI/180}ambient=new THREE.AmbientLight(3355443),scene.add(ambient),spotLight=new THREE.SpotLight(16777215),spotLight.position.set(1e3,500,1e3),spotLight.intensity=1,spotLight.castShadow=!0,spotLight.shadow.camera.near=.1,spotLight.shadow.camera.far=3e3,l=10,spotLight.shadow.camera.right=l,spotLight.shadow.camera.left=-l,spotLight.shadow.camera.top=l,spotLight.shadow.camera.bottom=-l,camera.add(spotLight),groundGeo=new THREE.PlaneBufferGeometry(2e4,2e4,32),groundMat=new THREE.MeshPhongMaterial({color:main_color,envMap:cubemap,reflectivity:.5,shininess:1}),ground=new THREE.Mesh(groundGeo,groundMat),ground.rotation.x=-90*Math.PI/180,ground.receiveShadow=!0,scene.add(ground),size=1e3,step=100,gridHelperHorizontal=new THREE.GridHelper(size,step),scene.add(gridHelperHorizontal),screenVertex=document.createElement("div"),document.body.appendChild(screenVertex),count=0,gridHelperHorizontal.geometry.vertices.forEach(function(e,t){count++,screenVertex.appendChild(a("vertex",t,e)),count==gridHelperHorizontal.geometry.vertices.length-1&&Adjust.trackElements("vertex")}),render=function(a){("undefined"==typeof e.tween||e.tween)&&TWEEN.update(a),Adjust.update(camera),animation(a),controls.update(),renderer.render(scene,camera),requestAnimationFrame(render)},window.onresize=function(){canvas_height=window.innerHeight*window.devicePixelRatio,canvas_width=window.innerWidth*window.devicePixelRatio,renderer.setSize(canvas_width,canvas_height),camera.aspect=canvas_width/canvas_height,camera.updateProjectionMatrix(),Adjust.resize()}}function createLabel(e,a){var t=document.createElement("div");return t.dataset.label="label-"+e,t.classList.add("label"),t.innerHTML="label "+e,t}function animation(e){camera.position.x=500*Math.sin(5e-4*e),camera.position.z=500*Math.cos(5e-4*e),camera.position.y=150+Math.max(300*-Math.sin(5e-4*e),300*Math.sin(5e-4*e))}var scene,camera,renderer,controls,ambient,spotLight,groundGeo,groundMat,ground,l,cubemap,urls,texture_base,main_color,time,canvas_height,canvas_width,size,step,screenVertex,count,render;init({controls:"trackball",fov:85,tween:!1}),Adjust.init();var labelBox=new THREE.SphereGeometry(45,32,32),Labels=[],holder=document.createElement("div");holder.classList.add("holder");for(var i=0;50>i;i++)Labels[i]=new THREE.Mesh(labelBox,new THREE.MeshPhongMaterial({color:934005,envMap:cubemap,reflectivity:.5,shininess:1,specular:new THREE.Color(2539758)})),Labels[i].position.x=Adjust.randNum(50,700,!0),Labels[i].position.y=Adjust.randNum(50,350,!1),Labels[i].position.z=Adjust.randNum(50,700,!0),Labels[i].name="label-"+i,Labels[i].castShadow=!0,Labels[i].receiveShadow=!0,holder.appendChild(createLabel(i,Labels[i].position)),scene.add(Labels[i]);document.body.appendChild(holder),Adjust.addLabel("label"),render();