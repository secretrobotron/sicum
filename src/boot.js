(function(){
  var ctx = require.config({
    paths: {
      'text': '../lib/text',
      'glmatrix': '../lib/glmatrix.min',
      'cubicvr': '../lib/CubicVR'
    }
  });

  var configs = [];
  var callbacks = [];

  var libs = [
    "glmatrix",
    "cubicvr"
  ];

  function addConfig(name, callback){
    configs.push('text!config/' + name + '.json');
    callback = callback || function(data){
      data = JSON.parse(data);
      var constituents = [];
      for(var i=0; i<data.length; ++i){
        constituents.push(name + '/' + data[i]);
      }
      return constituents;
    };
    callbacks.push(callback);
  }

  addConfig('components');
  addConfig('entities');
  addConfig('loaders');

  var includes = libs.concat(configs);

  ctx(includes, function(){

    var configConstituents = [];
    for(var i=libs.length; i<arguments.length; ++i){
      configConstituents = configConstituents.concat(callbacks[i-libs.length](arguments[i]));
    }

    ctx(['main'].concat(configConstituents), function(main){
      main.main();
    });

  });
}());