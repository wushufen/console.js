/*!
 * @preserve https://github.com/wusfen/console.js
 *
 * #f12 开启 Console控制台
 *
 * hash路由可用以下代替
 * url#/route#f12    url?f12    url?k=v&f12
 */
!function(){var d=function(){},p=function(e,o){for(var n in o)e[n]=o[n];return e},s=function(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()},n=function(e){var o=n.el=n.el||document.createElement("div");return o.innerHTML=e,o.children[0]},f=function(e,o){for(var n=0;n<e.children.length;n++){var t=e.children[n];if(o==t.className||o==t.tagName.toLowerCase())return t;var r=f(t,o);if(r)return r}},u=function(e,o){e.className+=" "+o},t=function(e,o){e.className=e.className.replace(RegExp(" *"+o,"ig"),"")},h=function(e,o){var n;n=o,e.className.match(n)?t(e,o):u(e,o)},g=n('<console> <style type="text/css"> console {z-index: 999999999; position: fixed; left: 0; right: 0; bottom: -1px; font-size: 12px; font-family: Menlo, Monaco, Consolas, "Courier New", monospace; line-height: 1.5; background: rgba(255, 255, 255, .98); box-shadow: rgba(0, 0, 0, 0.2) 0px 0 15px 0; transition: .5s; max-height: 0; max-height: 350px; max-width: 1024px; margin-left: auto; margin-right: auto; text-align: left; display: none; } @media all and (min-width:768px) {console ::-webkit-scrollbar {width: 6px; height: 10px; } console  ::-webkit-scrollbar-thumb {border-radius: 9px; border: 1px solid transparent; box-shadow: 0 0 0 5px rgba(0, 0, 0, .1) inset; } } @media all and (max-width:768px) {::-webkit-scrollbar {display: none; } } console * {font: inherit; box-sizing: border-box; } console.show {display: block; } console.closed {max-height: 0; } console.closed .f12 {opacity: .8; } console .f12 {position: absolute; bottom: 100%; right: 0; background: rgba(255, 255, 255, .98); border: solid 1px #eee; border-bottom: 0; border-radius: 5px 5px 0 0; padding: 5px; box-shadow: rgba(0, 0, 0, 0.1) 4px -4px 10px -4px; color: #555; letter-spacing: -1px; cursor: pointer; } console ul {list-style: none; overflow: auto; margin: 0; padding: 0; height: 350px; max-height: calc(100vh - 30px); padding-bottom: 3em; margin-bottom: -3em; } console .input {line-height: 1.25; display: block; width: 100%; border: none; outline: none; height: 3em; padding: .25em 1em; resize: none; position: relative; background: rgba(255, 255, 255, .8); } /* ios 滚动异常 */ @media all{console ul {-webkit-overflow-scrolling: touch; } console ul:before {content:""; float: left; height: calc(100% + 1px); width: 1px; margin-left: -1px; } } console ul li {padding: .5em; border-bottom: solid 1px #f7f7f7; overflow: auto; -webkit-overflow-scrolling: touch; } console ul li>.obj {float: left; max-width: 100%; padding: 0 .5em; } console .log {color: #555; } console .info {background: #f3faff; color: #0095ff; } console .warn {background: #fffaf3; color: #FF6F00; } console .error {background: #fff7f7; color: red; } console .cmd {position: relative; background: #fff; color: #0af; } console .cmd .key:before {content: "$ "; position: absolute; left: 0; color: #ddd; } console .obj {cursor: default; white-space: nowrap; } console .obj:after {content: ""; display: table; clear: both; } console .key {/*float: left;*/ /*margin-right: 1ex;*/ color: #a71d5d; } console .value {} console .value.tag {color: #a71d5d; } console .children {clear: both; padding-left: 2em; border-left: dotted 1px #ddd; display: none; } console .open>.value {white-space: pre; overflow: visible; max-width: none; } console .open>.children {display: block; } </style> <span class="f12">F12</span> <ul> <li> <div class="obj"> <span class="key"></span> <span class="value"></span> <div class="children"></div> </div> </li> </ul> <textarea class="input" placeholder="$"></textarea> </console> '),e=f(g,"f12"),a=f(g,"ul"),i=f(g,"li"),b=f(g,"obj"),v=(f(g,"children"),f(g,"input"));a.innerHTML="",e.onclick=function(){h(g,"closed")};var m=function(e,o,n){var t=a.scrollTop+a.clientHeight>a.scrollHeight-40,r=i.cloneNode(!0);u(r,e),r.innerHTML="",a.appendChild(r);for(var l=0;l<o.length;l++)x("",o[l],r,n);return 500<a.children.length&&a.removeChild(a.children[0]),t&&(a.scrollTop+=9999),r},x=function(e,n,o,t){var r=b.cloneNode(!0),l=f(r,"key"),a=f(r,"value"),i=f(r,"children");o.appendChild(r);var c=w(e,n,t);l.innerText=c.key,a.innerHTML=c.string.replace(/</g,"&lt;").replace(/>/g,"&gt;"),n=c.value,u(a,c.type),l.onclick=a.onclick=function(){if(v.value=n,window.v=n,h(r,"open"),!a._printed&&(a._printed=!0,"object"==typeof n)){var e="array"==s(n);for(var o in n)if(x(o,n[o],i,t),e&&500<o)return void x("...","",i,t)}}},w=function(e,o,n){var t,r=o;if(!o||o.toString||o.valueOf||(r="{...}"),!n)if(o&&o.nodeType){var l=o,a=l.nodeType;if(10==a)r="<!DOCTYPE html>";else if(1==a){var i=l.cloneNode().outerHTML.split("></"),c=i[0]+(i[1]?">":"");i[1];r=c,t="tag"}else 3==a?r=l.nodeValue:9==a?(r=l.nodeName,t="tag"):8==a&&(r="\x3c!--"+l.nodeValue+"--\x3e");o=function(e){for(var o=[],n=e.length;n--;)o[n]=e[n];return o}(l.childNodes),isNaN(e)||(e="")}else"array"==s(o)?r="("+o.length+")["+o+"]":o&&o._toConsole&&(r=o._toConsole(),delete o._toConsole);return{key:e,value:o,string:r+"",type:t}};function r(){var e=v.value;if(e){m("cmd",[e]).onclick=function(){v.value=e},e=e.match(/^\s*{/)?"("+e+")":e;var o=window.eval(e);console.log(o),v.value=""}}function y(){if(!y.bool){y.bool=!0;var e={log:d,info:d,warn:d,error:d,dir:d};window.console=window.console||e,console._back&&(console._back(),delete console._back);var o=p({},window.console);for(var n in e)!function(e){console[e]=function(){o[e].apply(console,arguments),m(e,arguments,"dir"==e)}}(n);addEventListener("error",function(e){m("error",i([e]))},!0);var t=window.XMLHttpRequest||d,c=t.prototype.open,s=t.prototype.send;t.prototype.open=function(n,t){var r,l,a=this,i=a.onreadystatechange;a.onreadystatechange=function(e){if(i&&i.apply(a,arguments),4==a.readyState){var o=400<a.status?"error":"info";u(l,o),l.innerHTML="",x("",{_toConsole:function(){return"["+n+"] "+a.status+" "+t},data:r,decodeData:decodeURIComponent(r),headers:a.getAllResponseHeaders(),response:function(){try{return JSON.parse(a.responseText)}catch(e){}return a.responseText}(),event:e,xhr:a},l)}},c.apply(this,arguments),a.send=function(e){l=m("log",[{_toConsole:function(){return"["+n+"] (pendding) "+t},data:r=e,decodeData:decodeURIComponent(e),response:"...",xhr:a}]),s.apply(this,arguments)}},setTimeout(function(){document.body.appendChild(g)},1);for(var r=console._logs||[],l=0;l<r.length;l++){var a=r[l];m(a.type,"error"==a.type?i(a.arr):a.arr)}delete console._logs}function i(e){if(1==e.length){var o=e[0],n=o.target,t=n.src||n.href;if(t){var r=o.target.outerHTML;return t=decodeURIComponent(t),[{tag:r,event:o,_toConsole:function(){return t}}]}return o._toConsole=function(){return o.message},[o,o.filename,o.lineno+":"+o.colno]}return e}}v.onkeydown=function(e){var o=v.value;if(13!=e.keyCode||!o.match(/[[{(,;]$/))return 13==e.keyCode&&""===o?(a.innerHTML="",!1):13==e.keyCode?(r(),!1):void 0},v.onblur=function(e){r()},navigator.userAgent.match(/mobile/i)&&y(),location.href.match(/[?&#]f12/)&&(u(g,"show"),y()),addEventListener("hashchange",function(e){location.hash.match("#f12")?(y(),u(g,"show")):t(g,"show")})}();