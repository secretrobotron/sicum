define(['util/lang', 'util/observer'], function(LangUtils, Observer){
  
  var __groups = null;
  var __loaders = {};
  var __assets = {};

  function Item(url, loader){
    var _data = null;
    var _loading = false;
    var loadItem = {
      url: url,
      get: function(callback){
        if(!_data){
          if(!_loading){
            loader(url, function(item){
              _data = item;
              loadItem.observer.notify('loaded', _data);
            });
            _loading = true;
          }
          loadItem.observer.subscribe('loaded', function loaded(){
            callback(_data);
            loadItem.observer.unsubscribe('loaded', loaded); 
          });
        }
        else{
          setTimeout(function(){
            callback(_data);
          }, 0);
        }
      }
    };
    Observer.extend(loadItem);
    return loadItem;
  }

  function Group(items, callback){
    var _toLoad = items.length;
    var _loaded = 0;
    var _loadedItems = {};

    if(callback){
      Loader.observer.subscribe('loaded-group', function loaded(){
        callback(_loadedItems);
        Loader.observer.unsubscribe('loaded-group', loaded);
      });
    }

    return {
      load: function(internalCallback){
        function loadItem(item){
          var url = item.url;
          item.get(function(item){
            __assets[url] = item;
            _loadedItems[url] = item;
            if(++_loaded === _toLoad){
              internalCallback(_loadedItems);
            }
          });
        }

        for (var i = items.length - 1; i >= 0; i--) {
          if(!__assets[items[i].url]){
            __assets[items[i].url] = Item(items[i].url, items[i].load);
          }
          loadItem(__assets[items[i].url]);
        }
      },

      getProgress: function(){
        return _loaded/_toLoad;
      }

    };
  }


  function startLoad(groups, generalCallback){
    var toLoad = groups.length;
    var loaded = 0;
    var loadedItems = [];

    function onLoaded(items){
      loadedItems = loadedItems.concat(items);
      if(++loaded === toLoad){
        generalCallback(loadedItems);
        Loader.observer.notify('loaded', loadedItems);
      }
    }
    for (var i = groups.length - 1; i >= 0; i--) {
      groups[i].load(onLoaded);
    };
  }

  var Loader = Observer.extend({

    gather: function(){
      __groups = [];
    },

    add: function(items, callback){
      callback = callback || function(){};
      if(!Array.isArray(items)){
        items = [items];
      }
      var loaders = [];
      for (var i = items.length - 1; i >= 0; i--) {
        var loaderType = items[i].type;
        var url = items[i].url;
        loaders.push(Loader.create(loaderType, url));
      };
      if(!__groups){
        Group(loaders).load(callback);
      }
      else{
        __groups.push(Group(loaders, callback));
      }
      
    },

    load: function(groupCallback){
      var groups = __groups;
      if(__groups){
        startLoad(groups, groupCallback);
      }
      __groups = null;
    },

    register: function(name, ctor){
      var loader = {
        create: function(url){
          return {
            url: url,
            load: ctor
          };
        }
      };

      __loaders[name] = loader;

      return loader;
    },

    create: function(loaderName){
      var namespace = __loaders[loaderName];
      if(namespace){
        var args = LangUtils.getArgsFrom(arguments, 1);
        return namespace.create.apply(namespace, args);
      }
      throw Error('Loader ' + loaderName + ' not defined');      
    },

    getTypes: function(){
      return Object.keys(__entities);
    }

  });

  return Loader;

});