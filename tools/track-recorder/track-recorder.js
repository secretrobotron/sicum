(function(){
  var requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
        })();

  var A_MINUTE = 60000;

  var __audio;

  var __beatStartTime = -1;
  var __bps = 0;

  var __numTracks = 0;

  var __beatPulser, __tracker, __playhead;

  var __lastTime = 0;

  var __selectedTrack;

  var CELL_HEIGHT_FACTOR = 2;

  var __keyFunctions = {
    ' ': function(e){
      e.preventDefault();
      if(__selectedTrack){
        var trackEvent = document.createElement('div');
        trackEvent.className = 'track-event';
        __selectedTrack.appendChild(trackEvent);
        trackEvent.style.top = __audio.currentTime / __audio.duration * __tracker.offsetHeight + 'px';
        trackEvent.setAttribute('data-time', __audio.currentTime);
      }
      if(document.body.scrollTop + window.innerWidth < __playhead.offsetTop || document.body.scrollTop > __playhead.offsetTop){
        trackPlayhead();
      }
    },

    't': function(){
      trackPlayhead();
    },

    'd': function(){
      removeTrack(__selectedTrack);
    },

    'v': function(){
      __audio.paused ? __audio.play() : __audio.pause();
    },

    'z': function(){
      __audio.currentTime = 0;
    },

    'q': function(e){
      setBPS(__bps - (e.shiftKey ? 0.1 : 1));
      __beatStartTime = -1;
    },

    'e': function(e){
      setBPS(__bps + (e.shiftKey ? 0.1 : 1));
      __beatStartTime = -1;
    },

    'r': function(){
      setBPS(__bps);
    },

    'w': function(){
      if(__beatStartTime === -1){
        __beatStartTime = Date.now();
        __beatPulser.classList.remove('pulse');
      }
      else {
        var duration = Date.now() - __beatStartTime;
        __beatStartTime = -1;
        setBPS(A_MINUTE/duration);
      }
    },

    'o': function(){
      removeTrack(__tracker.firstChild);
    },

    'p': function(){
      addTrack('Track' + (__numTracks + 1));
    },

    'j': function(){
      var data = {
        tracks: {}
      };
      for (var i = __tracker.childNodes.length - 1; i >= 0; i--) {
        var track = __tracker.childNodes[__numTracks - i - 1];
        var eventArray = data.tracks[track.getAttribute('data-name')] = [];
        for (var j = track.childNodes.length - 1; j >= 0; j--) {
          eventArray.push(Number(track.childNodes[track.childNodes.length - j - 1].getAttribute('data-time')));
        };
      };
      document.getElementsByTagName('textarea')[0].value = JSON.stringify(data, null, 2);
    }

  };

  function trackPlayhead(){
    document.body.scrollTop = __playhead.offsetTop;
  }

  function selectTrack(track){
    for (var i = __tracker.childNodes.length - 1; i >= 0; i--) {
      __tracker.childNodes[i].classList.remove('selected');
    }
    track.classList.add('selected');
    __selectedTrack = track;
  }

  function resizeTracks(){
    var trackIndex = 0;
    for (var i = __tracker.childNodes.length - 1; i >= 0; i--) {
      var node = __tracker.childNodes[i];
      if(node.classList.contains('track')){
        node.style.width = __tracker.offsetWidth / __numTracks + 'px';
        node.style.left = __tracker.offsetWidth / __numTracks * trackIndex++ + 'px';
      }
    }    
  }

  function addTrack(title){
    ++__numTracks;
    var track = document.createElement('div');
    track.className = 'track';
    __tracker.insertBefore(track, __tracker.firstChild);
    resizeTracks();
    track.addEventListener('click', function(){
      selectTrack(track);
    });
    track.setAttribute('data-name', title);
  }

  function removeTrack(track){
    --__numTracks;
    __tracker.removeChild(track);
    resizeTracks();
  }

  var __beatAccumulator = 0;
  function loop(){
    var beatDuration = 60000 / __bps;
    var time = Date.now();
    var elapsed = time - __lastTime;
    __beatAccumulator += elapsed;
    __beatPulser.style.background = 'rgba(0, 0, 255, ' + (beatDuration - __beatAccumulator)/beatDuration + ')';
    __lastTime = time;
    requestAnimFrame(loop);
    __playhead.style.top = __audio.currentTime / __audio.duration * __tracker.offsetHeight + 'px';
    if(__beatAccumulator > beatDuration){
      __beatAccumulator = 0;
    }
  }

  function setBPS(bps){
    __bps = Math.round(bps * 100) / 100;
    var time = A_MINUTE/__bps;
    // __beatPulser.style.MozAnimation = 'pulse ' + time + ' infinite';
    // __beatPulser.style.webkitAnimation = 'pulse ' + time + ' infinite';
    // __beatPulser.style.animation = 'pulse ' + time + ' infinite';
    // __beatPulser.classList.add('pulse');
    document.getElementById('bpm').innerHTML = __bps;
    __tracker.style.height = __bps * __audio.duration / 7.5 + 'px';
  }

  document.addEventListener('DOMContentLoaded', function(){
    __audio = document.getElementById('audio-source');
    __beatPulser = document.getElementById('beat-pulser');
    __tracker = document.getElementById('tracker');
    __playhead = document.getElementById('play-head');

    __audio.load();

    __audio.addEventListener('loadedmetadata', function(){
      setBPS(120);
      requestAnimFrame(loop);
    });

    document.addEventListener('keydown', function(e){
      var key = String.fromCharCode(e.which).toLowerCase();
      if(__keyFunctions[key]){
        __keyFunctions[key](e);
      }
    }, false);

    addTrack('Beats');
    addTrack('Track 1');
    addTrack('Track 2');
    addTrack('Track 3');
    addTrack('Track 4');
    addTrack('Track 5');

  }, false);

}());