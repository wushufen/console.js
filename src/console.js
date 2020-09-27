/*!
 * @preserve https://github.com/wusfen/console.js
 *
 * #f12 开启 Console控制台
 *
 * hash路由可用以下代替
 * url#/route#f12    url?f12    url?k=v&f12
 */

!(function (window) {
  var noop = function () { }

  var extend = function (obj, _obj) {
    for (var k in _obj) {
      obj[k] = _obj[k]
    }
    return obj
  }

  var toArray = function (arrayLike) {
    var arr = []
    var length = arrayLike.length
    while (length--) {
      arr[length] = arrayLike[length]
    }
    return arr
  }

  var typeOf = function (obj) {
    if (obj instanceof Element) {
      return 'element'
    }
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
    if (!hasClass(el, className)) {
      el.className += ' ' + className
    }
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
  var ConsoleEl = parse(`
  <console>
    <style>
      console {
        display: none;
        z-index: 999999999;
        position: fixed;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 0;
        max-height: calc(100vh - 30px);
        max-width: 768px;
        margin-left: auto;
        margin-right: auto;
        font-size: 12px;
        font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
        line-height: 1.5;
        background: rgba(255, 255, 255, .98);
        color: #555;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 0 15px 0;
        transition: .3s ease-in;
        text-align: left;
        cursor: default;
        touch-action: manipulation;
        -webkit-overflow-scrolling: touch;
        -webkit-text-size-adjust: none;
      }
      console.show {
        display: block;
      }
      console.open {
        height: 400px;
        transition: .3s ease-out;
      }
      @media all and (min-width:768px) {
        console ::-webkit-scrollbar {
          width: 6px;
          height: 10px;
        }
        console ::-webkit-scrollbar-thumb {
          border-radius: 9px;
          border: 1px solid transparent;
          box-shadow: 0 0 0 5px rgba(0, 0, 0, .1) inset;
        }
      }
      @media all and (max-width:768px) {
        ::-webkit-scrollbar {
          display: none;
        }
      }
      @media all {
        console ul {
          -webkit-overflow-scrolling: touch;
        }
        console ul:before {
          content: "";
          float: left;
          height: calc(100% + 1px);
          width: 1px;
          margin-left: -1px;
        }
      }
      console * {
        font: inherit;
        box-sizing: border-box;
      }
      console .f12 {
        position: absolute;
        bottom: 100%;
        right: 0;
        padding: 3px 5px;
        border: solid 1px #eee;
        border-bottom: 0;
        border-radius: 5px 5px 0 0;
        background: rgba(255, 255, 255, .8);
        box-shadow: rgba(0, 0, 0, 0.1) 4px -4px 10px -4px;
        color: #555;
        letter-spacing: -1px;
        cursor: pointer;
      }
      console .words{
        display: flex;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        padding: 0 .5em;
        white-space: nowrap;
        overflow: auto;
        border-top: solid 1px rgba(230, 230, 230, 0.0);
        border-bottom: solid 1px rgba(230, 230, 230, 0.38);
        background: rgba(243, 250, 255, 0.5);
        color: #333;
        -webkit-backdrop-filter: blur(1px);
        backdrop-filter: blur(1px);
        text-shadow: 1px 1px 5px #fff;
      }
      console .words>*{
        padding: .25em .5em;
      }
      console ul {
        height: 100%;
        padding: 0;
        padding-top: 26px;
        padding-bottom: 3em;
        margin: 0;
        margin-bottom: -3em;
        overflow: auto;
        list-style: none;
      }
      console .input {
        line-height: 1.25;
        display: block;
        width: 100%;
        border: none;
        outline: none;
        height: 3em;
        padding: .25em 1em;
        resize: none;
        position: relative;
        background: rgba(255, 255, 255, .5);
        -webkit-backdrop-filter: blur(1px);
        backdrop-filter: blur(1px);
      }
      console ul li {
        display: flex;
        padding: .25em .5em;
        border-bottom: solid 1px rgba(230, 230, 230, 0.38);
        border-top: solid 1px #fff;
        overflow: auto;
        white-space: nowrap;
      }
      console ul li>.obj {
        display: inline-block;
        vertical-align: top;
        padding: 0 .5em;
      }
      console ul li>.obj:last-child {
        flex: 1;
      }
      console .log {
        background: #fcfeff;
      }
      console .info {
        color: #0095ff;
        background: #f3faff;
      }
      console .warn {
        color: #FF6F00;
        background: #fffaf3;
      }
      console .error {
        color: red;
        background: #fff7f7;
      }
      console .cmd {
        position: relative;
        color: #0af;
        background: #fff;
      }
      console .cmd .key:before {
        content: "$ ";
        position: absolute;
        left: 0;
        color: #ddd;
      }
      console .obj {
        white-space: nowrap;
      }
      console .key {
        color: #a71d5d;
      }
      console .value {}
      console .htmldocument>.value,
      console .element>.value {
        color: #a71d5d;
      }
      console .htmldocument>.value:after,
      console .element>.value:after {
        content: ' ⇿';
      }
      console .htmldocument.open>.value:after,
      console .element.open>.value:after {
        visibility: hidden;
      }
      console .obj .obj.open>.value {
        display: inline-block;
        vertical-align: top;
        max-width: 100vw;
        white-space: pre-wrap;
        word-break: break-word;
        padding-right: 2em;
      }
      console .children {
        max-width: 350px;
        max-height: 0;
        padding-left: 1em;
        border-left: dotted 1px #ddd;
        overflow: hidden;
        opacity: 0;
        transition: .3s cubic-bezier(0, 1, 0, 1), opacity .7s;
      }
      console .open>.children {
        max-width: 59999px;
        max-height: 59999px;
        overflow: auto;
        opacity: 1;
        transition: .3s cubic-bezier(1, 0, 1, 0), opacity .7s;
      }
    </style>
    <span class="f12">F12</span>
    <div class="words">
      <span>clear</span>
      <span>location</span>
      <span>document</span>
      <span>localStorage</span>
      <span>sessionStorage</span>
      <span>document.cookie</span>
      <span>window</span>
      <span>screen</span>
      <span>navigator</span>
      <span>history</span>
      <span>performance</span>
      <span>getComputedStyle($0)</span>
      <span>dir(temp1)</span>
      <a href="https://github.com/wusfen/console.js" target="_blank">
        <svg style="height: 1em;width:1em;vertical-align:middle" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
          <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </a>
    </div>
    <ul>
      <li>
        <div class="obj">
          <span class="key"></span>
          <span class="value"></span>
          <div class="children"></div>
        </div>
      </li>
    </ul>
    <textarea class="input" placeholder="$"></textarea>
  </console>
  `)
  var F12El = find(ConsoleEl, 'f12')
  var UlEl = find(ConsoleEl, 'ul')
  var LiEl = find(ConsoleEl, 'li')
  var ObjEl = find(ConsoleEl, 'obj')
  var ChildrenEl = find(ConsoleEl, 'children')
  var InputEl = find(ConsoleEl, 'input')
  var WordsEl = find(ConsoleEl, 'words')

  // init clear
  UlEl.innerHTML = ''

  // console toggle
  F12El.onclick = function () {
    toggleClass(ConsoleEl, 'open')
  }

  // print
  var printLi = function (type, objs) {
    // is scroll end
    var isEnd = UlEl.scrollTop + UlEl.clientHeight > UlEl.scrollHeight - 40

    // clone li 
    var liEl = LiEl.cloneNode(true)
    addClass(liEl, type)
    liEl.innerHTML = ''
    UlEl.appendChild(liEl)

    // log(a,b,...c)
    for (var i = 0; i < objs.length; i++) {
      printObj('', objs[i], liEl, type)
    }

    // li max
    if (UlEl.children.length > 500) {
      UlEl.removeChild(UlEl.children[0])
    }

    // scroll
    if (isEnd) {
      UlEl.scrollTop += 9999
    }

    return liEl
  }

  // li>.obj
  var printObj = function (key, value, target, type) {
    // clone objEl
    var objEl = ObjEl.cloneNode(true)
    var keyEl = find(objEl, 'key')
    var valueEl = find(objEl, 'value')
    var childrenEl = find(objEl, 'children')
    target.appendChild(objEl)

    // key
    keyEl.innerText = key

    // value
    valueEl.innerHTML = escapeTag(toString(value))
    addClass(objEl, typeOf(value))

    // chidren
    objEl.onclick = valueEl.onclick = function (e) {
      // toggle
      toggleClass(objEl, 'open')

      // temp, $n
      var $i = 10
      if (value instanceof Element) {
        while ($i--) {
          console['$' + $i] = console['$' + ($i - 1)]
        }
        console.$0 = value
      } else {
        while ($i--) {
          console['temp' + $i] = console['temp' + ($i - 1)]
        }
        console.temp1 = value
        console.v = value
      }

      // stop
      e.stopPropagation()
      if (typeof value != 'object') return
      if (valueEl._printed) return
      valueEl._printed = true

      // childNodes
      if (value && value.childNodes && type !== 'dir') {
        var childNodes = toArray(value.childNodes)
        for (var i = 0; i < childNodes.length; i++) {
          var childNode = childNodes[i]
          printObj('', childNode, childrenEl)
        }
        return
      }

      // keys
      for (var k in value) {
        printObj(k, value[k], childrenEl)
        // max
        if (typeOf(value) == 'array' && k > 500) {
          printObj('...', '', childrenEl)
          return
        }
      }

    }
  }

  // value show
  function toString(value) {
    // !
    if (!value) {
      return value + ''
    }

    // __string__
    if (value.__string__) {
      var __string__ = value.__string__
      delete value.__string__
      return __string__
    }

    // object
    if (typeOf(value) == 'object') {
      var k0 = Object.keys(value)[0]
      if (k0 === undefined) return '[Object]{}'
      var v0 = value[k0]
      return `${value}{ ${k0}: ${String(v0).slice(0, 15)} …}`.replace(/^\[object /, '[')
    }

    // ErrorEvent
    if (value.message) {
      return value.message
    }

    // event.type:error
    if (value.type === 'error') {
      return `[error] ${toString(value.target)}`
    }

    // array
    if (value instanceof Array) {
      return '(' + value.length + ')[' + value + ']'
    }

    // node
    var node = value || ''
    var nodeType = node.nodeType

    // #document
    if (nodeType == 9) {
      return node.nodeName
    }

    // doctype
    if (nodeType == 10) {
      return '<!DOCTYPE html>'
    }

    // tag
    if (nodeType == 1) {
      var tag = node.cloneNode().outerHTML
      var tagLR = tag.split(/(?=<\/|$)/)
      var tagL = tagLR[0]
      return tagL
    }

    // text
    if (nodeType == 3) {
      return node.nodeValue
    }

    // commemt
    if (nodeType == 8) {
      return '<!--' + node.nodeValue + '-->'
    }

    return value + ''
  }

  // run code
  function run() {
    var code = InputEl.value
    if (!code) return
    if (code == 'clear') {
      UlEl.innerHTML = ''
      InputEl.value = ''
      return
    }

    // print input
    var cmdLi = printLi('cmd', [code])
    // input again
    cmdLi.code = code
    cmdLi.addEventListener('click', function () {
      InputEl.value = cmdLi.code
    }, true)

    // scroll
    setTimeout(function () {
      UlEl.scrollTop += 9999
    })

    // exec, print
    code = /^\s*{/.test(code) ? '(' + code + ')' : code // ({})
    code = /^await/.test(code) ? `(async()=>{console.log(${code})})()` : code // await 1
    code = `with(console){${code}}` // dir
    var rs = window.eval(code)
    InputEl.value = ''
    console.log(rs)
  }

  // input code
  InputEl.onkeydown = function (event) {
    var code = InputEl.value

    // br
    if (event.keyCode == 13 && code.match(/[[{(,;]$/)) {
      return
    }
    // clear
    if (event.keyCode == 13 && code === '') {
      UlEl.innerHTML = '';
      return false;
    }
    // run
    if (event.keyCode == 13) {
      run()
      return false
    }
  }
  InputEl.onblur = function (event) {
    run()
  }

  // words
  WordsEl.onclick = function (e) {
    var span = e.target
    if (!/span/i.test(span.tagName)) return

    InputEl.value = span.innerHTML
    run()
  }

  // intercept: console, error, xhr, fetch
  function intercept() {
    if (intercept.bool) return
    intercept.bool = true

    // _console
    var con = {
      log: noop,
      info: noop,
      warn: noop,
      error: noop,
      dir: noop,
      table: noop,
    }
    window.console = window.console || con
    var _console = extend({}, window.console)

    // intercept console
    for (var type in con) {
      ! function (type) {
        console[type] = function (arg) {
          _console[type].apply(this, arguments)
          printLi(type, arguments)
        }
      }(type)
    }

    // intercept error
    addEventListener('error', function (e) {
      printLi('error', [e])
      // true catch (js, css, img) error
    }, true)

    // intercept xhr
    var XHR = window.XMLHttpRequest || noop
    var XHRopen = XHR.prototype.open
    var XHRsend = XHR.prototype.send
    XHR.prototype.open = function (method, url) {
      var xhr = this
      var requestHeaders = {}
      var requestBody
      var liEl
      var startTime = new Date

      var onreadystatechange = xhr.onreadystatechange
      xhr.onreadystatechange = function (e) {
        onreadystatechange && onreadystatechange.apply(xhr, arguments)
        if (xhr.readyState != 4) return
        var endTime = new Date
        var time = endTime - startTime
        var status = xhr.status
        var logType = /^(2..|304)$/.test(status) ? 'info' : 'error'

        liEl.innerHTML = ''
        addClass(liEl, logType)
        printObj('', {
          __string__: `[${method}] (${status}) ${time}ms ${url}`,
          requestHeaders,
          requestBody: function () {
            requestBody = decodeURIComponent(requestBody)
            try {
              return JSON.parse(requestBody)
            } catch (e) { }
            return requestBody
          }(),
          responseHeaders: xhr.getAllResponseHeaders(),
          responseBody: (function () {
            var response = xhr.response || xhr.responseText
            try {
              return JSON.parse(response)
            } catch (e) { }
            return response
          })(),
          xhr: xhr,
        }, liEl)
      }

      // apply
      XHRopen.apply(this, arguments)

      // headers
      var setRequestHeader = xhr.setRequestHeader
      xhr.setRequestHeader = function (key, value) {
        requestHeaders[key] = value
        setRequestHeader.apply(this, arguments)
      }

      xhr.send = function (requestBody) {
        // pending
        liEl = printLi('info', [{ __string__: `[${method}] (pending) ${url}`, requestBody }])
        XHRsend.apply(this, arguments)
      }
    }

    // intercept fetch
    var _fetch = window.fetch
    if (_fetch) {
      window.fetch = function () {
        var url = arguments[0]
        var options = arguments[1] || ''
        var method = options.method || 'GET'
        var startTime = new Date

        // pending
        var liEl = printLi('info', [{ __string__: `[${method}] (pending) ${url}`, requestInit: options }])

        // apply
        var promise = _fetch.apply(this, arguments)
          .then(function (res) {
            var endTime = new Date
            var time = endTime - startTime
            var status = res.status
            var logType = /^(2..|304)$/.test(status) ? 'info' : 'error'

            // end
            res.clone().text().then(function (text) {
              liEl.innerHTML = ''
              addClass(liEl, logType)
              printObj('', {
                __string__: `[${method}] (${status}) ${time}ms ${url}`,
                requestInit: options,
                responseHeaders: function () {
                  var keys = res.headers.keys()
                  var next
                  var obj = {}
                  while ((next = keys.next()), !next.done) {
                    obj[next.value] = res.headers.get(next.value)
                  }
                  return obj
                }(),
                responseBody: function () {
                  try {
                    return JSON.parse(text)
                  } catch (e) { }
                  return text
                }(),
                response: res,
              }, liEl)
            })

            return res
          })
          .catch(function (e) {
            addClass(liEl, 'error')
            liEl.innerHTML = ''
            printObj('', {
              __string__: `[${method}] (Failed) ${url}`,
              requestInit: options,
              response: e.message,
            }, liEl)

            return Promise.reject(e)
          })

        return promise
      }
    }

    // temp
    console.temp1 = document
    console.$0 = document.body

    // insert ConsoleEl
    setTimeout(function () {
      document.documentElement.appendChild(ConsoleEl)
    }, 1)

  }

  // console.show = true || 1 || 2
  var consoleShow = console.show
  Object.defineProperty(console, 'show', {
    configurable: true,
    set(value) {
      consoleShow = value
      if (value) {
        intercept()
        setTimeout(function () {
          addClass(ConsoleEl, 'show')
          removeClass(ConsoleEl, 'open')
        })
      }
      if (value == 2) {
        setTimeout(function () {
          addClass(ConsoleEl, 'open')
        }, 100)
      }
      if (!value) {
        removeClass(ConsoleEl, 'show')
        removeClass(ConsoleEl, 'open')
      }
    },
    get() {
      return consoleShow
    }
  })
  if (consoleShow) {
    console.show = consoleShow
  }
  // mobile
  if (navigator.userAgent.match(/mobile/i)) {
    intercept()
  }
  // pc when #f12
  if (location.href.match(/[?&#]f12/)) {
    console.show = 1
  }
  // #f12
  addEventListener('hashchange', function (e) {
    if (location.hash.match('#f12')) {
      console.show = 1
    } else {
      console.show = 0
    }
  })

})(window)
