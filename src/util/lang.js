define([], function(){
  
  return {

    getArgsFrom: function(args, index){
      return Array.prototype.slice.call(args, index);
    }

  };

});