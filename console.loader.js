/*! @preserve https://github.com/wusfen/console.js */
(function() {
    var noop = function() {}
    var extend = function(obj, _obj) {
        for (var k in _obj) {
            obj[k] = _obj[k]
        }
        return obj
    }

    // logs 存储
    var logs = []
    logs.max = 200
    var errorHandler
    var hashchangeHandler
    var con = {
        log: noop,
        info: noop,
        warn: noop,
        error: noop,
        dir: noop
    }
    window.console = window.console || con
    var _console = extend({}, window.console)

    // 判断 mobile 进行拦截
    if (navigator.userAgent.match(/mobile/i)) {
        intercept()
    }

    // cnosole 拦截
    function intercept() {

        // console 拦截
        for (var type in con) {
            ! function(type) {
                console[type] = function() {
                    _console[type].apply(console, arguments)
                    logs.push({
                        type: type,
                        arguments: arguments
                    })
                    if (logs.length > logs.max) {
                        logs.shift()
                    }
                }
            }(type)
        }

        // 捕获 js 异常
        addEventListener('error', errorHandler = function(e) {
            var src = e.target.src || e.target.href
            var arguments
            if (src) {
                e.toString = function() { return src }
                arguments = [e]
            } else {
                e.toString = function() { return e.message }
                arguments = [e, e.filename, e.lineno + ':' + e.colno]
            }
            logs.push({
                type: 'error',
                arguments: [e]
            })
        }, true)
    }

    // 监听 #f12 加载 console.js
    addEventListener('hashchange', hashchangeHandler = function() {
        if (location.href.match(/[?&#]f12/)) {
            loadConsoleJs()
        }
    })
    hashchangeHandler()

    // console.js 加载
    function loadConsoleJs() {
        // 取消监听
        removeEventListener('error', errorHandler)
        removeEventListener('hashchange', hashchangeHandler)

        // create script
        var scripts = document.scripts
        var thisScript
        var consoleAttr
        for (var i = scripts.length - 1; i >= 0; i--) {
            var script = scripts[i]
            var src = script.src || ''
            // console="path/to/console.js"
            consoleAttr = script.getAttribute('console')
            if (consoleAttr !== null || src.match(/(^|\/)console./)) {
                thisScript = script
                break
            }
        }
        var src = thisScript.src.replace(/[\w.]*$/, 'console.js')
        var script = document.createElement('script')
        script.src = consoleAttr || src

        // 留时间给后面的log
        setTimeout(function() {
            // 还原 console
            for (var k in con) {
                console[k] = _console[k]
            }
            // 在还原后加载
            document.getElementsByTagName('head')[0].appendChild(script)
        }, 41)
    }

    // 数据传递
    console._logs = logs

})()