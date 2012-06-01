define(['util/event', 'util/lang'], function(Event, LangUtils){
  
  var __components = {};

  return {

    register: function(componentName, ctor){

      var namespace = {

        create: function(){
          var component = {
            bind: function(entity){
              component.entity = entity;
              component.event.dispatch('bind', entity);
            },
            unbind: function(){
              if(component.entity){
                var oldEntity = component.entity
                component.entity = null;
                component.event.dispatch('unbind', entity);
              }
            },
            componentName: componentName
          };

          Event.extend(component);

          var args = LangUtils.getArgsFrom(arguments, 0);
          args.unshift(component);
          ctor.apply(component, args);

          return component;
        },

        name: componentName

      };

      __components[componentName] = namespace;

      return namespace;

    },

    create: function(componentName){
      var namespace = __components[componentName];
      if(namespace){
        var args = LangUtils.getArgsFrom(arguments, 1);
        return namespace.create(args);
      }
      throw Error('Component ' + componentName + ' not defined');
    },

    getTypes: function(){
      return Object.keys(__components);
    }

  };

});