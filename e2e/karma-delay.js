'use strict';

window.__karma__.start = (function(start){
return function(){
  var args = arguments
  setTimeout(() => {
    start(args)
  }, 1000);
};
}(window.__karma__.start));
