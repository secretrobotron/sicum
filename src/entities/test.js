define(['engine/entity'], function(Entity){  
  return Entity.register('test', {
      assets: [
        { 'type': 'image', 'url': 'assets/images/brick-diffuse.jpg' }
      ],
      components: {
        'model': {
        }
      }
    },
    function(entity){
      var components = entity.components;
      var modelComponent = components.model;

      entity.event.add('loaded', function(items){
        console.log('group loaded', items);
      });
      
    });

});