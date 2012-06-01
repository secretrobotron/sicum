define(["util/observer", "engine/schedule", "engine/scene"], function(Observer, Schedule, Scene){
  
  var __frames = 0,
      __scenes = [];

  function renderModel(model, transform, camera, lights, skipTrans, skipSolid, transparencies, wireframe){

    var flipFaces = false;
    var gl = GLCore.gl;

    var mesh = model.mesh;

    if(!mesh){
      return;
    }

    skipTrans = skipTrans || false;
    skipSolid = skipSolid || false;

    flipFaces = object.scale[0] < 0 ? !flipFaces : flipFaces;
    flipFaces = object.scale[1] < 0 ? !flipFaces : flipFaces;
    flipFaces = object.scale[2] < 0 ? !flipFaces : flipFaces;

    if(flipFaces){
      gl.cullFace(gl.FRONT);
    }

    if(CubicVR.renderObject(mesh, camera, sceneObj.tMatrix, lights, skip_trans, skip_solid, wireframe) && transparencies) {
      transparencies.push(sceneObj);
    }

    if(flipFaces){
      gl.cullFace(gl.BACK);
    }

  }

  Schedule.on('render', function(){
    var scenes = __scenes.slice();
    for (var j = scenes.length - 1; j >= 0; j--) {
      var scene = scenes[j];
      var entities = scene.entities;
      for (var i = entities.length - 1; i >= 0; i--) {
        var entity = entities[i];
        if(entity.model && entity.transform){
          renderModel(entity.model, entity.transform, camera, lights, true, true, false, []);  
        }
      }
    };

    ++__frames;

  });

  var Graphics = {};

  Scene.observer.subscribe('enabled', function(scene){
    __scenes.push(scene);
  });

  Scene.observer.subscribe('disabled', function(scene){
    __scenes.splice(__scenes.indexOf(scene), 1);
  });

  Observer.extend(Graphics);

  return Graphics;

});