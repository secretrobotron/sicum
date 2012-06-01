define(["../../lib/glmatrix.min.js", "engine/component"], function(GLMatrix, Component){
  
  return Component.register('transform', function(component){

    component.rotation = [0, 0, 0];
    component.position = [0, 0, 0];
    component.scale = [1, 1, 1];

    component.relativeMatrix = mat4.identity(mat4.create());
    component.absoluteMatrix = mat4.identity(mat4.create());

    component.compute = function(parentMatrix){
      var mat = component.relativeMatrix,
          pos = component.position,
          rot = component.rotation,
          scale = component.scale;

      mat4.identity(mat);
      mat4.translate(mat, pos);
      mat4.rotateX(mat, rot[0]);
      mat4.rotateY(mat, rot[1]);
      mat4.rotateZ(mat, rot[2]);
      mat4.scale(mat, scale);

      if(parentMatrix){
        mat4.multiply(parentMatrix, mat, component.absoluteMatrix);
      }
      else{
        mat4.set(mat, component.absoluteMatrix);
      }

      return mat;
    };

  });

});