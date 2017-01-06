;
(function() {

    // view
    var tpl = '<style type="text/css"> .console {font-size: 12px; font-family: "微软雅黑"; position: fixed; -position: absolute; z-index: 9999999999; bottom: 0; right: 0; width: 800px; width: 100%; max-width: 100%; background: rgba(255, 255, 255, .6); box-shadow: 0 0 10px 10px rgba(169, 163, 163, 0.06); text-shadow: 1px 1px 2px rgb(77, 150, 255); } .list {max-height: 250px; -height: 250px; overflow: auto; padding-right: 16px; width: 100%; } .cmd {margin: 0; border-bottom: solid 1px #eee; margin-bottom: -1px; padding: 6px; white-space: pre-wrap; word-wrap: break-word; color: red; padding-left: 1.5em; text-indent: -1em; } .row {margin: 0; border-bottom: solid 1px #eee; margin-bottom: -1px; padding: 6px; white-space: pre-wrap; word-wrap: break-word; } .input {display: block; width: 100%; border: none; border-top: solid 1px #ccc; outline: none; background: rgba(1,1,1,0); /*ie6 不能设为 none; 必须有背景，不然html标签跑到前面挡住*/ position: relative; z-index: 9999999999; height: 50px; } </style> <div class="console"> <div class="list"> <pre class="cmd">...</pre> <pre class="row">...</pre> </div> <textarea class="input" placeholder="run js" autofocus></textarea> </div>';
    var elMap = parseTpl(tpl);
    var consoleListEl = elMap.list;
    consoleListEl.innerHTML = '';

    setTimeout(function() {
        document.body.appendChild(elMap.console);
    }, 10);

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
                node.removeAttribute('class');
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
        var rowEl = elMap.row.cloneNode(true);
        var str = stringify(obj);
        rowEl.innerHTML = str;
        consoleListEl.appendChild(rowEl);
        consoleListEl.scrollTop = 999999;
        // alert(stringify(obj));
    }

    // console
    var winConsole = window.console || {
        log: function() {},
        dir: function() {},
        error: function() {}
    };
    var console = {
        run: run,
        log: function() {
            winConsole.log.apply(winConsole, arguments);
            for (var i = 0; i < arguments.length; i++) {
                log(arguments[i]);
            }
        },
        dir: function(obj) {
            winConsole.dir(obj);
            log(obj);
        },
        error: function(obj) {
            winConsole.error(obj);
            log(obj);
        }
    };


    // run
    function run(code) {
        // label
        var cmdEl = elMap.cmd.cloneNode(true);
        cmdEl.innerHTML = '> ' + code.replace(/\n/g, '<br>').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        consoleListEl.appendChild(cmdEl);
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
        if (event.keyCode == 13 && !this.value.match(/;\s{0,2}$/)) {
            console.run(this.value);
            this.value = '';
            return false;
        }
    }

    /**
     * get obj type
     * @param  {*} obj - any type
     * @return {String} - the type of obj
     */
    function type(obj) {
        return ({}.toString.call(obj).match(/ (.*)\]/))[1].toLowerCase();
    }

    /**
     * stringify obj
     * @param  {*} obj - any type
     * @param  {Number} n - loop deep
     * @return {String}
     */
    function stringify(obj, n) {
        n = n || 0;
        if (n > 2) { // 遍历深度限制
            return '...'
        }

        if (type(obj) == 'array') {
            var str = '['
            for (var i = 0; i < obj.length; i++) {
                str += stringify(obj[i]) + ', ';
            }
            str = str.replace(/, $/, '');
            str += ']';
            return str;
        }
        if (type(obj) == 'object') {
            var str = '{\n';
            var _obj = {};
            for (var i = 0; i < (obj || {}).length; i++) { // for ie
                var item = obj[i];
                if (item !== undefined) {
                    _obj[i] = item;
                }
            }
            for (var i in obj) {
                _obj[i] = obj[i];
            }

            var max = 10;
            var maxI = 0;
            for (var i in _obj) {
                if (maxI++ > max) { // 遍历长度限制
                    str += '.';
                    continue
                }
                str += Array(n + 2).join('　') + '"' + i + '": ' + stringify(_obj[i], n + 1) + ',\n';
            }
            str = str.replace(/,\n$/, '');
            str += '\n' + Array(n + 1).join('　') + '}';
            return str;
        }

        if (typeof obj == 'string') {
            return '<sub style="color:red">"</sub>' +
                obj.replace(/\n/g, '<br>').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '<sub style="color:red">"</sub>';
        }

        return obj + '';

    }

    function toArray(arrayLike) {
        var arr = [];
        var length = arrayLike.length;
        while (length--) {
            arr[length] = arrayLike[length];
        }
        return arr;
    }

    // catch error
    onerror = function() {
        console.error(toArray(arguments));
        // return true; // 表示已处理
    }

}());
