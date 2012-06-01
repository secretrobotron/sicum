define([], function(){

  var __callbackPool = [];

  function flush(){
    var callbacks = __callbackPool.slice();
    __callbackPool = [];
    while(callbacks.length > 0){
      var item = callbacks.pop();
      item.callback(item.context);
    }
  }

  function add(name, callback, callbacks){
    if(!callbacks[name]){
      callbacks[name] = [];
    }
    callbacks[name].push(callback);
  }

  function remove(name, callback, callbacks){
    if(callbacks[name]){
      var idx = callbacks[name].indexOf(callback);
      if(idx > -1){
        callbacks[name].splice(idx, 1);
      }
    }    
  }

  function dispatch(name, data, callbacks, origin){
    var list = callbacks[name];
    if(list){
      list = list.slice();
      for(var i = 0, l = list.length; i < l; ++i){
        __callbackPool.push({
          context: data,
          callback: list[i]
        });
      }
    }
  }

  function extend(object){

    if(object.event){
      return;
    }

    var _callbacks = {};

    object.event = {
      add: function(name, callback){
        add(name, callback, _callbacks);
      },
      remove: function(name, callback){
        remove(name, callback, _callbacks);
      },
      dispatch: function(name, data){
        dispatch(name, data, _callbacks, object);
      }
    };

    return object;

  }

  return {

    flush: flush,
    extend: extend

  };

});