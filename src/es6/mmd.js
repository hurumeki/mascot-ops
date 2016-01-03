var mesh,
  camera,
  scene,
  renderer,
  helper,
  clock = new THREE.Clock();

function init(mascotConfig, container) {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.y = 5;
  camera.position.z = 30;

  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight( 0x666666 );
  scene.add( ambient );

  var directionalLight = new THREE.DirectionalLight( 0x887766 );
  directionalLight.position.set( -1, 1, 1 ).normalize();
  scene.add( directionalLight );

  renderer = new THREE.WebGLRenderer( { alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight - 4 );
  container.appendChild( renderer.domElement );
  container.style.visibility = 'hidden';

  var progress = document.createElement('span');
  progress.classList.add('progress');
  document.body.appendChild(progress);
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      progress.innerText = 'Loading... ' + Math.round(percentComplete, 2) + '%';
    }
  };

  var onError = function ( xhr ) {
  };

  var modelFile = mascotConfig.model;
  var vmdFiles = mascotConfig.motions;

  helper = new THREE.MMDHelper( renderer );
  var loader = new THREE.MMDLoader();
  loader.setDefaultTexturePath( mascotConfig.texturePath );

  loader.load( modelFile, vmdFiles, function ( object ) {

    mesh = object;
    mesh.position.y = -10;

    helper.add( mesh );
    helper.setAnimation( mesh );
    helper.setPhysics( mesh );
    helper.unifyAnimationDuration();

    scene.add( mesh );

    document.body.removeChild(progress);
    container.style.visibility = 'visible';

  }, onProgress, onError );

  window.addEventListener( 'resize', onWindowResize, false );

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight - 4 );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  camera.lookAt( scene.position );

  if ( mesh ) {
    helper.animate( clock.getDelta() );
    helper.render( scene, camera );
  } else {
    renderer.clear();
    renderer.render( scene, camera );
  }
}

export default init;
