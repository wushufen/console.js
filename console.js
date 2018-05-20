/*!
 * https://github.com/wusfen/console.js
 */
!(function() {

    var noop = function() {}

    var extend = function(obj, _obj) {
        for (var k in _obj) {
            obj[k] = _obj[k]
        }
        return obj
    }

    function toArray(arrayLike) {
        var arr = [];
        var length = arrayLike.length;
        while (length--) {
            arr[length] = arrayLike[length];
        }
        return arr;
    }

    var parse = function(html) {
        var el = parse.el = parse.el || document.createElement('div')
        el.innerHTML = html
        return el.children[0]
    }
    var find = function(el, selector) {
        for (var i = 0; i < el.children.length; i++) {
            var child = el.children[i]
            if (selector == child.className || selector == child.tagName.toLowerCase()) {
                return child
            } else {
                var r = find(child, selector)
                if (r) {
                    return r
                }
            }
        }
    }
    var addClass = function(el, className) {
        el.className += ' ' + className
    }
    var removeClass = function(el, className) {
        el.className = el.className.replace(RegExp(' *' + className, 'ig'), '')
    }
    var hasClass = function(el, className) {
        return el.className.match(className)
    }
    var toggleClass = function(el, className) {
        if (hasClass(el, className)) {
            removeClass(el, className)
        } else {
            addClass(el, className)
        }
    }

    // view
    var view = parse('<div console> <style type="text/css"> .console {position: fixed; left: 0; right: 0; bottom: -1px; font-size: 12px; font-family: Menlo, Monaco, Consolas, "Courier New", monospace; line-height: 1.5; background: rgba(255, 255, 255, .98); box-shadow: rgba(0, 0, 0, 0.2) 0px 0 15px 0; transition: .5s; max-height: 0; max-height: 500px; display: none; } .console * {font: inherit; box-sizing: border-box; } .console.show {display: block; } .console.closed {max-height: 0; } .console.closed .f12 {opacity: .8; } .console .f12 {position: absolute; bottom: 100%; right: 0; background: rgba(255, 255, 255, .98); border: solid 1px #eee; border-bottom: 0; border-radius: 5px 5px 0 0; padding: 5px; box-shadow: rgba(0, 0, 0, 0.1) 4px -4px 10px -4px; /*box-shadow: rgba(0, 0, 0, 0.2) 0px -5px 15px -5px;*/ color: #555; letter-spacing: -1px; cursor: pointer; } .console ul {list-style: none; margin: 0; padding: 0; padding-bottom: 3em; margin-bottom: -3em; max-height: 350px; overflow: auto; -webkit-overflow-scrolling: touch; } .console ul li {padding: .5em 1em; border-bottom: solid 1px #f7f7f7; overflow: auto; } .console ul li>.obj {float: left; max-width: 100%; } .console .log {color: #555; } .console .info {background: #f3faff; color: #0095ff; } .console .warn {background: #fffaf3; color: #FF6F00; } .console .error {background: #fff7f7; color: red; } .console .cmd {position: relative; background: #fff; color: #0af; } .console .cmd .key:before {content: "$ "; position: absolute; left: 0; color: #ddd; } .console .obj {cursor: default; } .console .key {color: #a71d5d; white-space: nowrap; } .console .value {white-space: pre; } .console .children {padding-left: 2em; border-left: dotted 1px #ddd; display: none; } .console .children.open {display: block; } .console .input {line-height: 1.25; display: block; width: 100%; border: none; outline: none; height: 3em; padding: .25em 1em; resize: none; position: relative; background: rgba(255, 255, 255, .8); } </style> <div class="console"> <span class="f12">F12</span> <ul> <li> <div class="obj"> <span class="key"></span> <span class="value"></span> <div class="children"></div> </div> </li> </ul> <textarea class="input" placeholder="$" autofocus></textarea> </div> </div>')
    var consoleEl = find(view, 'console')
    var f12El = find(consoleEl, 'f12')
    var ulEl = find(consoleEl, 'ul')
    var liEl = find(consoleEl, 'li')
    var objEl = find(consoleEl, 'obj')
    var childrenEl = find(consoleEl, 'children')
    var inputEl = find(consoleEl, 'input')

    ulEl.innerHTML = ''

    // console 折叠
    f12El.onclick = function() {
        toggleClass(consoleEl, 'closed')
    }

    // print
    var printLi = function(type, objs, isDir) {
        // 判断滚动条是不是在最下方，是则打印后继续滚到最后
        if (ulEl.scrollTop + ulEl.clientHeight > ulEl.scrollHeight - 20) {
            setTimeout(function() {
                ulEl.scrollTop += 999
            }, 41)
        }

        // 复制一个 li 
        var _liEl = liEl.cloneNode(true)
        addClass(_liEl, type)
        _liEl.innerHTML = ''
        ulEl.appendChild(_liEl)

        // 打印 log(a,b,c) 多个参数
        for (var i = 0; i < objs.length; i++) {
            printObj('', objs[i], _liEl, isDir)
        }

        // 限制打印列表长度
        if (ulEl.children.length > 200) {
            ulEl.removeChild(ulEl.children[0])
        }
    }
    var printObj = function(key, value, target, isDir) {
        // 复制一个 obj view
        var _objEl = objEl.cloneNode(true)
        var _keyEl = find(_objEl, 'key')
        var _valueEl = find(_objEl, 'value')
        var _childrenEl = find(_objEl, 'children')
        target.appendChild(_objEl)

        // 如果 value 是 html 节点
        if (!isDir && value && value.nodeType) {

            if (value.nodeType == 1) {
                // 标签节点
                var tag = value.cloneNode().outerHTML
                var tag_lr = tag.split('></')
                var tagl = tag_lr[0] + '>'
                var tagr = '</' + tag_lr[1]
                _keyEl.innerText = tagl
                _valueEl.innerText = ''
            } else if (value.nodeType == 3) {
                // 有文字的文本节点才显示
                if (value.nodeValue.match(/\S/)) {
                    _valueEl.innerText = value.nodeValue.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                }
            } else if (value.nodeType == 9) {
                // #document节点
                _keyEl.innerText = key
                _valueEl.innerText = value.nodeName
            }

            // value 改为 子节点，后面点开则遍历子节点，而不是遍历一个对象
            var childNodes = value.childNodes
            value = toArray(value.childNodes)
        } else {

            // 普通对象（非html节点)
            _keyEl.innerText = key
            _valueEl.innerText = value + ' ' // innerText=null 为清空
        }

        // 点击时遍历对象
        if (value && typeof value == 'object') {
            // 是对象则注册点击
            _keyEl.onclick = _valueEl.onclick = function() {

                // toggle children
                toggleClass(_childrenEl, 'open')

                // 是否已经打印过了
                if (_valueEl._printed) {
                    return
                }
                _valueEl._printed = true;

                // 打印
                printChildren(value, _childrenEl, isDir)
            }
        }
    }
    var printChildren = function(obj, childrenEl, isDir) {
        for (var i in obj) {
            printObj(i, obj[i], childrenEl, isDir)
        }
    }

    // 执行 js
    inputEl.onkeydown = function(event) {
        // 清空
        if (event.keyCode == 13 && inputEl.value === '') {
            ulEl.innerHTML = '';
            return false;
        }
        // 打印与执行
        if (event.keyCode == 13) {
            // 打印输入
            var code = inputEl.value
            printLi('cmd', [code])

            // 选择完清空输入框，滚动
            setTimeout(function() {
                inputEl.value = ''
                ulEl.scrollTop += 9999
            }, 41)

            // 执行
            code = code.match(/^\s*{/) ? '(' + code + ')' : code; // ({})
            var rs = window.eval(code)
            // 打印结果
            console.log(rs)
            return false
        }
    }

    // console 拦截
    var con = {
        log: noop,
        info: noop,
        warn: noop,
        error: noop,
        dir: noop
    }
    window.console = window.console || con
    var _console = extend({}, window.console)

    function intercept() {
        if (intercept.bool) {
            return
        }
        intercept.bool = true

        // console 拦截
        for (var type in con) {
            ! function(type) {
                console[type] = function() {
                    _console[type].apply(console, arguments)
                    printLi(type, arguments, type == 'dir')
                }
            }(type)
        }

        // 捕获 js 异常
        addEventListener('error', function(e) {
            printLi('error', [e.message, e.filename, e.lineno + ':' + e.colno])
        })

        // 插入视图
        setTimeout(function() {
            document.body.appendChild(view)
        }, 1)
    }

    // 手机预先拦截，以接管 console
    if (navigator.userAgent.match(/mobile/i)) {
        intercept()
    }
    // pc端为了不影响 console 的代码定位，#f12 才拦截
    // #f12 显示， pc端拦截
    if (location.hash == '#f12') {
        addClass(consoleEl, 'show')
        intercept()
    }
    // #f12 切换
    addEventListener('hashchange', function(e) {
        if (location.hash == '#f12') {
            intercept()
            addClass(consoleEl, 'show')
        } else {
            removeClass(consoleEl, 'show')
        }
    })

})()