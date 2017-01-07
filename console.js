/*!
 * https://github.com/wusfen/console.js
 */
;
(function() {
    // toggle
    if (!location.href.match(/[?&]console/)) return;

    // view
    var tpl = '    <style type="text/css"> .console {font-size: 12px; line-height: 1.1; position: fixed; -position: absolute; z-index: 9999999999; bottom: 0; right: 0; width: 800px; width: 100%; max-width: 100%; /*text-shadow: 1px 1px 2px rgb(0, 140, 160);*/ color: #000; } .listw {height: 120px; overflow: auto; overflow-x: hidden; padding-right: 16px; width: 100%; margin-right: -16px; } .list {margin-top: 120px; max-height: 100px; -height: 250px; overflow: auto; padding-right: 32px; margin-right: -32px; width: 100%; background: rgba(255, 255, 255, .98); box-shadow: 0 -5px 15px rgba(1, 1, 1, 0.1); padding-bottom: 1em; } .cmd {margin: 0; border-top: solid 1px #eee; padding: 6px; white-space: pre-wrap; word-wrap: break-word; color: red; padding-left: 1.5em; text-indent: -1em; } .obj {padding: 0 6px; line-height: 1.5; word-wrap: break-word; } .key {color: #a71d5d; } .value {color: #000; } .children {padding-left: 1em; } .input {display: block; width: 100%; border: none; border-top: solid 1px #eee; outline: none; height: 30px; box-shadow: 0 -8px 10px rgba(255, 255, 255, 0.8); } </style> <div class="console"> <div class="listw"> <div class="list"> <div class="cmd">...</div> <div class="obj"> <span class="key">*: </span> <span class="value">[object Object]</span> <div class="children"></div> </div> </div> </div> <textarea class="input" placeholder="run js" autofocus></textarea> </div>';
    var elMap = parseTpl(tpl);
    elMap.list.innerHTML = '';

    setTimeout(function() {
        document.body.appendChild(elMap.console);
        elMap.listw.scrollTop = 999999;
    }, 100);

    function parseTpl(tpl) {
        var elMap = {};
        var styleRe = /<style .*?>([\w\W]*?)<\/style>/i; //ie 中为大写
        var styleStr = (tpl.match(styleRe) || [])[1];

        var parseWrapEl = document.createElement('div');
        parseWrapEl.innerHTML = tpl.replace(styleRe, '');

        (function loop(node) {
            var className = node.className;
            if (className) {
                elMap[className] = node;
                var classRe = RegExp('\\.' + className + '\\s*?\\{([\\w\\W]*?)\\}');
                node.setAttribute('style', (styleStr.match(classRe) || [])[1]);
                // node.removeAttribute('class');
            }
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                loop(child);
            }
        })(parseWrapEl);

        return elMap;
    }

    // log
    function log(obj) {
        print(obj);
        elMap.listw.scrollTop = 999999;
        elMap.list.scrollTop = 999999;
    }

    function print(obj, key, parentChildrenEl) {
        var parentEl = parentChildrenEl || elMap.list;
        var objEl = elMap.obj.cloneNode();
        var keyEl = elMap.key.cloneNode(true);
        var valueEl = elMap.value.cloneNode(true);
        var childrenEl = elMap.children.cloneNode();
        parentEl.appendChild(objEl);
        objEl.appendChild(keyEl);
        objEl.appendChild(valueEl);
        objEl.appendChild(childrenEl);

        key = key === undefined ? '< ' : key + ': ';
        keyEl.innerHTML = key;
        valueEl.innerHTML = (obj+'').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        if (typeof obj == 'object') {
            valueEl.onclick = function() {
                childrenEl.style.display = childrenEl.style.display != 'block' ? 'block' : 'none';
                if (valueEl.hasPrint) {
                    return
                }
                for (var key in obj) {
                    var item = obj[key];
                    print(item, key, childrenEl);
                }
                valueEl.hasPrint = true;
            }
        }
    }

    // console
    function noop() {}
    var winConsole = window.console || (window.console = {
        log: noop,
        dir: noop,
        info: noop,
        warn: noop,
        error: noop
    });
    var console = {
        run: run,
        log: function() {
            for (var i = 0; i < arguments.length; i++) {
                log(arguments[i]);
            }
        },
        dir: log,
        error: log
    };
    for (var i in console) {
        (function() {
            var key = i;
            var fn = winConsole[key];
            winConsole[key] = function() {
                fn && fn.apply(winConsole, arguments);
                console[key].apply(console, arguments);
            }
        })();
    }


    // run
    function run(code) {
        // label
        var cmdEl = elMap.cmd.cloneNode(true);
        cmdEl.innerHTML = '> ' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
        elMap.list.appendChild(cmdEl);
        // value
        code = code.match(/^\s*{/) ? '(' + code + ')' : code; // ({})
        try {
            console.log(window.eval(code));
        } catch (e) {
            // console.log(e);
            throw e;
        }
    }

    // input code
    elMap.input.onkeydown = function() {
        if (event.keyCode == 13 && this.value === '') {
            elMap.list.innerHTML = '';
            return false;
        }
        if (event.keyCode == 13 && !this.value.match(/;\s{0,2}$/)) {
            run(this.value);
            this.value = '';
            return false;
        }
    }


    // catch error
    onerror = function() {
        var s = '';
        for (var i = 0; i < arguments.length; i++) {
            s += arguments[i] + '|';
        }
        log(s);
        // return true; // 表示已处理
    }

}());
