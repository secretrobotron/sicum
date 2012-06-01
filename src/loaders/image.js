define(['engine/loader'], function(Loader){
  
  return Loader.register('image', function(url, onReady){
    var image = new Image();
    image.onload = function(){
      onReady(image);
    };
    image.src = url;
  });

});