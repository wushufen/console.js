/*! @preserve https://github.com/wusfen/console.js */
!function(n,a){var i,s,o=function(){},r=n.addEventListener,l=n.removeEventListener,e=[];e.max=100;var f={log:o,info:o,warn:o,error:o,dir:o};n.console=n.console||f;var u=function(n,o){for(var r in o)n[r]=o[r];return n}({},n.console);navigator.userAgent.match(/mobile/i)&&function(){for(var n in f)!function(n){console[n]=function(){u[n].apply(console,arguments),e.push({type:n,arr:arguments}),e.length>e.max&&e.shift()}}(n);r("error",i=function(n){e.push({type:"error",arr:[n]})},!0)}(),r("hashchange",s=function(){location.href.match(/[?&#]f12/)&&function(){l("error",i),l("hashchange",s);for(var n,o,r=a.scripts,e=r.length-1;0<=e;e--){var t=r[e],c=t.src||"";if(null!==(o=t.getAttribute("console"))||c.match(/(^|\/)console[\w.]*$/)){n=t;break}}var c=n.src.replace(/[\w.]*$/,"console.js");(t=a.createElement("script")).src=o||c,setTimeout(function(){for(var n in f)console[n]=u[n];a.body.appendChild(t)},41)}()}),s(),console._logs=e}(window,document);