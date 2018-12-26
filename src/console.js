/*!
 * @preserve https://github.com/wusfen/console.js
 *
 * #f12 开启 Console控制台
 *
 * hash路由可用以下代替
 * url#/route#f12    url?f12    url?k=v&f12
 */
!(function () {

    var noop = function () { }

    var extend = function (obj, _obj) {
        for (var k in _obj) {
            obj[k] = _obj[k]
        }
        return obj
    }

    var toArray = function (arrayLike) {
        var arr = [];
        var length = arrayLike.length;
        while (length--) {
            arr[length] = arrayLike[length];
        }
        return arr;
    }

    var typeOf = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    }

    var escapeTag = function (html) {
        return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    var parse = function (html) {
        var el = parse.el = parse.el || document.createElement('div')
        el.innerHTML = html
        return el.children[0]
    }
    var find = function (el, selector) {
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
    var addClass = function (el, className) {
        el.className += ' ' + className
    }
    var removeClass = function (el, className) {
        el.className = el.className.replace(RegExp(' *' + className, 'ig'), '')
    }
    var hasClass = function (el, className) {
        return el.className.match(className)
    }
    var toggleClass = function (el, className) {
        if (hasClass(el, className)) {
            removeClass(el, className)
        } else {
            addClass(el, className)
        }
    }

    // view
    var ConsoleEl = parse('<console> <style type="text/css"> console {z-index: 999999999; position: fixed; left: 0; right: 0; bottom: -1px; font-size: 12px; font-family: Menlo, Monaco, Consolas, "Courier New", monospace; line-height: 1.5; background: rgba(255, 255, 255, .98); box-shadow: rgba(0, 0, 0, 0.2) 0px 0 15px 0; transition: .5s; max-height: 0; max-height: 350px; max-width: 1024px; margin-left: auto; margin-right: auto; text-align: left; display: none; } @media all and (min-width:768px) {console ::-webkit-scrollbar {width: 6px; height: 10px; } console  ::-webkit-scrollbar-thumb {border-radius: 9px; border: 1px solid transparent; box-shadow: 0 0 0 5px rgba(0, 0, 0, .1) inset; } } @media all and (max-width:768px) {::-webkit-scrollbar {display: none; } } console * {font: inherit; box-sizing: border-box; } console.show {display: block; } console.closed {max-height: 0; } console.closed .f12 {opacity: .8; } console .f12 {position: absolute; bottom: 100%; right: 0; background: rgba(255, 255, 255, .98); border: solid 1px #eee; border-bottom: 0; border-radius: 5px 5px 0 0; padding: 5px; box-shadow: rgba(0, 0, 0, 0.1) 4px -4px 10px -4px; color: #555; letter-spacing: -1px; cursor: pointer; } console ul {list-style: none; overflow: auto; margin: 0; padding: 0; height: 350px; max-height: calc(100vh - 30px); padding-bottom: 3em; margin-bottom: -3em; } console .input {line-height: 1.25; display: block; width: 100%; border: none; outline: none; height: 3em; padding: .25em 1em; resize: none; position: relative; background: rgba(255, 255, 255, .8); } /* ios 滚动异常 */ @media all{console ul {-webkit-overflow-scrolling: touch; } console ul:before {content:""; float: left; height: calc(100% + 1px); width: 1px; margin-left: -1px; } } console ul li {padding: .5em; border-bottom: solid 1px #f7f7f7; overflow: auto; -webkit-overflow-scrolling: touch; } console ul li>.obj {float: left; max-width: 100%; padding: 0 .5em; } console .log {color: #555; } console .info {background: #f3faff; color: #0095ff; } console .warn {background: #fffaf3; color: #FF6F00; } console .error {background: #fff7f7; color: red; } console .cmd {position: relative; background: #fff; color: #0af; } console .cmd .key:before {content: "$ "; position: absolute; left: 0; color: #ddd; } console .obj {cursor: default; white-space: nowrap; } console .obj:after {content: ""; display: table; clear: both; } console .key {/*float: left;*/ /*margin-right: 1ex;*/ color: #a71d5d; } console .value {} console .value.tag {color: #a71d5d; } console .children {clear: both; padding-left: 2em; border-left: dotted 1px #ddd; display: none; } console .open>.value {white-space: pre; overflow: visible; max-width: none; } console .open>.children {display: block; } </style> <span class="f12">F12</span> <ul> <li> <div class="obj"> <span class="key"></span> <span class="value"></span> <div class="children"></div> </div> </li> </ul> <textarea class="input" placeholder="$"></textarea> </console> ')
    var F12El = find(ConsoleEl, 'f12')
    var UlEl = find(ConsoleEl, 'ul')
    var LiEl = find(ConsoleEl, 'li')
    var ObjEl = find(ConsoleEl, 'obj')
    var ChildrenEl = find(ConsoleEl, 'children')
    var InputEl = find(ConsoleEl, 'input')

    UlEl.innerHTML = ''

    // console 折叠
    F12El.onclick = function () {
        toggleClass(ConsoleEl, 'closed')
    }

    // print
    var printLi = function (type, objs, isDir) {
        // 判断滚动条是不是在最下方
        var isEnd = UlEl.scrollTop + UlEl.clientHeight > UlEl.scrollHeight - 40
        // document.title = UlEl.scrollTop + 't ' + UlEl.clientHeight + 'h ' + UlEl.scrollHeight + 'H ' + isEnd

        // 复制一个 li 
        var liEl = LiEl.cloneNode(true)
        addClass(liEl, type)
        liEl.innerHTML = ''
        UlEl.appendChild(liEl)

        // 打印 log(a,b,c) 多个参数
        for (var i = 0; i < objs.length; i++) {
            printObj('', objs[i], liEl, isDir)
        }

        // 限制打印列表长度
        if (UlEl.children.length > 500) {
            UlEl.removeChild(UlEl.children[0])
        }

        // 滚到最后
        if (isEnd) {
            UlEl.scrollTop += 9999
        }

        return liEl
    }
    var printObj = function (key, value, target, isDir) {
        // 复制一个 obj view
        var objEl = ObjEl.cloneNode(true)
        var keyEl = find(objEl, 'key')
        var valueEl = find(objEl, 'value')
        var childrenEl = find(objEl, 'children')
        target.appendChild(objEl)

        // value print convert
        var kvs = printConvert(key, value, isDir)
        keyEl.innerText = kvs.key
        valueEl.innerHTML = escapeTag(kvs.string)
        value = kvs.value
        addClass(valueEl, kvs.type)

        // 点击时遍历对象
        keyEl.onclick = valueEl.onclick = function () {
            window.v = value

            // toggle children, value...
            toggleClass(objEl, 'open')

            // 是否已经打印过了
            if (valueEl._printed) {
                return
            }
            valueEl._printed = true

            if (typeof value != 'object') return
            var isArray = typeOf(value) == 'array'

            // 打印 children
            for (var i in value) {
                printObj(i, value[i], childrenEl, isDir)
                // 过长
                if (isArray && i > 500) {
                    printObj('...', '', childrenEl, isDir)
                    return
                }
            }

            // UlEl.scrollTop += 10
            // UlEl.scrollTop -= 10
        }
    }

    var printConvert = function (key, value, isDir) {
        var string = value
        var type
        if (value && !value.toString && !value.valueOf) {
            string = '{...}'
        }

        if (!isDir) {

            // node
            if (value && value.nodeType) {
                var node = value
                var nodeType = node.nodeType

                // doctype
                if (nodeType == 10) {
                    string = '<!DOCTYPE html>'
                }
                // tag
                else if (nodeType == 1) {
                    var tag = node.cloneNode().outerHTML
                    var tag_lr = tag.split('></')
                    var tagl = tag_lr[0] + (tag_lr[1] ? '>' : '') // ?有无闭合标签
                    var tagr = '</' + tag_lr[1]
                    string = tagl
                    type = 'tag'
                }
                // text
                else if (nodeType == 3) {
                    string = node.nodeValue
                }
                // #document
                else if (nodeType == 9) {
                    string = node.nodeName
                    type = 'tag'
                }
                // commemt
                else if (nodeType == 8) {
                    string = '<!--' + node.nodeValue + '-->'
                }

                // childNodes
                value = toArray(node.childNodes)
                if (!isNaN(key)) {
                    key = ''
                }
            }

            // array
            else if (typeOf(value) == 'array') {
                string = '(' + value.length + ')[' + value + ']'
            }

            // _toConsole
            else if (value && value._toConsole) {
                string = value._toConsole()
                delete value._toConsole
            }

        }

        return {
            key: key,
            value: value,
            string: string + '',
            type: type
        }
    }

    function run() {
        var code = InputEl.value
        if (!code) return

        // 打印输入
        printLi('cmd', [code])

        // 执行
        code = code.match(/^\s*{/) ? '(' + code + ')' : code; // ({})
        var rs = window.eval(code)

        // 打印结果
        console.log(rs)

        // 清空输入框，滚动
        InputEl.value = ''
    }

    // 执行 js
    InputEl.onkeydown = function (event) {
        var code = InputEl.value

        // 换行
        if (event.keyCode == 13 && code.match(/[[{(,;]$/)) {
            return
        }
        // 清空
        if (event.keyCode == 13 && code === '') {
            UlEl.innerHTML = '';
            return false;
        }
        // 打印与执行
        if (event.keyCode == 13) {
            run()
            return false
        }
    }

    InputEl.onblur = function (event) {
        run()
    }

    // console 拦截
    function intercept() {
        if (intercept.bool) {
            return
        }
        intercept.bool = true

        // _console 副本
        var con = {
            log: noop,
            info: noop,
            warn: noop,
            error: noop,
            dir: noop
        }
        window.console = window.console || con
        // console.loader.js 还原
        if (console._back) {
            console._back()
            delete console._back
        }
        var _console = extend({}, window.console)

        // console 拦截
        for (var type in con) {
            ! function (type) {
                console[type] = function () {
                    _console[type].apply(console, arguments)
                    printLi(type, arguments, type == 'dir')
                }
            }(type)
        }

        // 捕获 js 异常
        addEventListener('error', function (e) {
            printLi('error', converErrors([e]))
            // true 捕获阶段，能捕获 js css img 加载异常
        }, true)

        // ajax 拦截
        var XHR = window.XMLHttpRequest || noop
        var XHRopen = XHR.prototype.open
        var XHRsend = XHR.prototype.send
        XHR.prototype.open = function (type, url) {
            var xhr = this
            var sendData
            var liEl

            var onreadystatechange = xhr.onreadystatechange
            xhr.onreadystatechange = function (e) {
                onreadystatechange && onreadystatechange.apply(xhr, arguments)

                if (xhr.readyState != 4) return

                var logType = xhr.status > 400 ? 'error' : 'info'
                addClass(liEl, logType)
                liEl.innerHTML = ''
                printObj('', {
                    _toConsole: function () { return '[' + type + '] ' + xhr.status + ' ' + url },
                    data: sendData,
                    decodeData: decodeURIComponent(sendData),
                    headers: xhr.getAllResponseHeaders(),
                    response: (function () { try { return JSON.parse(xhr.responseText) } catch (e) { } return xhr.responseText })(),
                    event: e,
                    xhr: xhr
                }, liEl)
            }

            XHRopen.apply(this, arguments)

            xhr.send = function (data) {

                sendData = data
                liEl = printLi('log', [{
                    _toConsole: function () { return '[' + type + '] ' + '(pendding)' + ' ' + url },
                    data: data,
                    decodeData: decodeURIComponent(data),
                    response: '...',
                    xhr: xhr
                }])

                XHRsend.apply(this, arguments)
            }
        }


        // xxx.file m:n
        function converErrors(arr) {
            if (arr.length == 1) {
                var e = arr[0]
                var target = e.target
                var src = target.src || target.href
                if (src) {
                    var tag = e.target.outerHTML
                    src = decodeURIComponent(src)
                    return [{
                        tag: tag,
                        event: e,
                        _toConsole: function () { return src }
                    }]
                } else {
                    e._toConsole = function () { return e.message }
                    return [e, e.filename, e.lineno + ':' + e.colno]
                }
            }
            return arr
        }

        // 插入视图
        setTimeout(function () {
            document.body.appendChild(ConsoleEl)
        }, 1)

        // 打印 loader 的 logs ======================
        var _logs = console._logs || []
        for (var i = 0; i < _logs.length; i++) {
            var _log = _logs[i]
            printLi(_log.type, _log.type == 'error' ? converErrors(_log.arr) : _log.arr)
        }
        delete console._logs
    }

    // 手机预先拦截，以接管 console
    if (navigator.userAgent.match(/mobile/i)) {
        intercept()
    }
    // pc端为了不影响 console 的代码定位，#f12 才拦截
    // #f12 显示， pc端拦截
    if (location.href.match(/[?&#]f12/)) {
        addClass(ConsoleEl, 'show')
        intercept()
    }
    // #f12 切换
    addEventListener('hashchange', function (e) {
        if (location.hash.match('#f12')) {
            intercept()
            addClass(ConsoleEl, 'show')
        } else {
            removeClass(ConsoleEl, 'show')
        }
    })

})()