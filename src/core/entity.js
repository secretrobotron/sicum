define(["util/event", "util/lang", "engine/component", "engine/loader"], function(Event, LangUtils, Component, Loader){
  
  var __entities = {};

  return {

    register: function(entityName, description, ctor){
      var namespace = {
        create: function(){
          var _children = [];
          var _components = {};

          var entity = {
            components: _components,
            bindComponent: function(component){
              if(typeof(component) === 'string'){
                component = Component.create(component, arguments);
              }
              if(!component){
                throw Error('Component is null.');
              }
              _components[component.componentName] = component;
              component.bind(entity);
              entity.event.dispatch('component-added', component);
              return component;
            },
            unbindComponent: function(name){
              var component = _components[name];
              if(component){
                _components.unbind(_this);
                delete _components[name];
                _this.event.dispatch('component-removed', component);          
              }
              return component;
            },
            addChild: function(childEntity){
              _children.push(childEntity);
              return childEntity;
            },
            removeChild: function(childEntity){
              var idx = _children.indexOf(childEntity);
              if(idx > -1){
                _children.splice(idx, 1);
              }
              return childEntity;
            },
            children: _children
          };

          Event.extend(entity);

          entity.bindComponent('transform');

          if(description.components){
            for(var cName in description.components){
              if(description.components.hasOwnProperty(cName)){
                var c = Component.create(cName, description.components[cName]);
                entity.bindComponent(c);
              }
            }
          }

          if(description.assets){
            Loader.add(description.assets, function(items){
              entity.event.dispatch('loaded', items);
            });
          }

          var args = LangUtils.getArgsFrom(arguments, 0);
          args.unshift(entity);
          ctor.apply(entity, args);

          return entity;
        }
      };
      __entities[entityName] = namespace;

      return namespace;
    },

    create: function(entityName){
      var namespace = __entities[entityName];
      if(namespace){
        var args = LangUtils.getArgsFrom(arguments, 1);
        return namespace.create.apply(namespace, args);
      }
      throw Error('Entity ' + entityName + ' not defined');      
    },

    getTypes: function(){
      return Object.keys(__entities);
    }

  };

});