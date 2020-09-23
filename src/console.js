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
    var arr = []
    var length = arrayLike.length
    while (length--) {
      arr[length] = arrayLike[length];
    }
    return arr
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
        max-height: 0;
        max-width: 768px;
        margin-left: auto;
        margin-right: auto;
        font-size: 12px;
        font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
        line-height: 1.5;
        background: rgba(255, 255, 255, .98);
        box-shadow: rgba(0, 0, 0, 0.2) 0px 0 15px 0;
        transition: .375s;
        text-align: left;
        cursor: default;
        -webkit-overflow-scrolling: touch;
        touch-action: manipulation;
      }
      console.show {
        display: block;
      }
      console.open {
        max-height: 355px;
        max-height: calc(100vh - 30px);
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
        background: rgba(255, 255, 255, .98);
        box-shadow: rgba(0, 0, 0, 0.1) 4px -4px 10px -4px;
        color: #555;
        letter-spacing: -1px;
        cursor: pointer;
        opacity: .8;
      }
      console .words{
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        padding: 0 .75em;
        white-space: nowrap;
        overflow: auto;
        border-bottom: solid 1px rgba(230, 230, 230, 0.38);
        background: rgba(243, 250, 255, 0.5);
        backdrop-filter: blur(1px);
        text-shadow: 1px 1px 5px #fff;
      }
      console .words>*{
        display: inline-block;
        padding: .375em .25em;
      }
      console ul {
        height: 355px;
        max-height: calc(100vh - 30px - 36px);
        padding: 0;
        padding-top: 28px;
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
      }
      console ul li {
        padding: .375em .5em;
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
      console .log {
        color: #555;
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
      console .obj:after {
        content: "";
        display: table;
        clear: both;
      }
      console .key {
        color: #a71d5d;
      }
      console .value {}
      console .value.tag {
        color: #a71d5d;
      }
      console .value.tag:after {
        content: ' ⇿';
      }
      console .open>.value.tag:after {
        content: '';
      }
      console .children {
        clear: both;
        padding-left: 1em;
        border-left: dotted 1px #ddd;
        display: none;
      }
      console .open>.value {
        display: inline-block;
        vertical-align: top;
        white-space: pre;
        overflow: visible;
        max-width: none;
      }
      console .open>.children {
        display: block;
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
      <span>devicePixelRatio</span>
      <span>navigator</span>
      <span>history</span>
      <span>performance</span>
      <span>temp1</span>
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

  UlEl.innerHTML = ''

  // console 折叠
  F12El.onclick = function () {
    toggleClass(ConsoleEl, 'open')
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
      // toggle children, value...
      toggleClass(objEl, 'open')

      if (typeof value != 'object') return
      window.v = value
      window.temp1 = value

      // 是否已经打印过了
      if (valueEl._printed) {
        return
      }
      valueEl._printed = true

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

    }
  }

  var printConvert = function (key, value, isDir) {
    var string = value
    var type = typeOf(value)
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

      // __string__
      else if (value && value.__string__) {
        string = value.__string__
        delete value.__string__
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
    if (code == 'clear') {
      UlEl.innerHTML = ''
      InputEl.value = ''
      return
    }

    // 打印输入
    var cmdLi = printLi('cmd', [code])
    cmdLi.onclick = function () {
      InputEl.value = code
    }

    // 滚到最后
    setTimeout(function () {
      UlEl.scrollTop += 9999
    })

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

  // words
  WordsEl.onclick = function (e) {
    var span = e.target
    if (!/span/i.test(span.tagName)) return

    InputEl.value = span.innerHTML
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
        console[type] = function (arg) {
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
      var startTime = new Date

      var onreadystatechange = xhr.onreadystatechange
      xhr.onreadystatechange = function (e) {
        onreadystatechange && onreadystatechange.apply(xhr, arguments)
        if (xhr.readyState != 4) return

        var logType = /^(2..|3..)$/.test(xhr.status) ? 'info' : 'error'
        var endTime = new Date
        var time = endTime - startTime

        addClass(liEl, logType)
        liEl.innerHTML = ''

        printObj('', {
          __string__: '[' + type + '] (' + xhr.status + ') ' + (time + 'ms') + ' ' + url,
          data: sendData,
          dataParsed: function () {
            try {
              return JSON.parse(decodeURIComponent(sendData))
            } catch (e) { }
            return decodeURIComponent(sendData)
          }(),
          AllResponseHeaders: xhr.getAllResponseHeaders(),
          responseParsed: (function () {
            try {
              return JSON.parse(xhr.responseText)
            } catch (e) { }
            return xhr.responseText
          })(),
          event: e,
          xhr: xhr
        }, liEl)
      }

      XHRopen.apply(this, arguments)

      xhr.send = function (data) {

        sendData = data
        liEl = printLi('info', [{
          __string__: '[' + type + '] ' + '(pending)' + ' ' + url,
          data: data,
          dataParsed: function () {
            try {
              return JSON.parse(decodeURIComponent(sendData))
            } catch (e) { }
            return decodeURIComponent(sendData)
          }(),
          response: 'pending',
          xhr: xhr
        }])

        XHRsend.apply(this, arguments)
      }
    }

    // fetch 拦截
    var _fetch = window.fetch
    if (_fetch) {
      window.fetch = function () {
        var url = arguments[0]
        var options = arguments[1] || ''
        var method = options.method || 'GET'
        var startTime = new Date

        var liEl = printLi('info', [{
          __string__: '[' + method + '] ' + '(pending)' + ' ' + url,
          RequestInit: options,
          Response: 'pending'
        }])

        // apply
        var promise = _fetch.apply(this, arguments)
          .then(function (res) {
            var endTime = new Date
            var time = endTime - startTime
            var logType = /^(2..|3..)$/.test(res.status) ? 'info' : 'error'
            addClass(liEl, logType)

            res.clone().text().then(function (text) {
              liEl.innerHTML = ''
              printObj('', {
                __string__: '[' + method + '] (' + res.status + ') ' + (time + 'ms') + ' ' + url,
                RequestInit: options,
                Response: res,
                ResponseHeaders: function(){
                  var keys = res.headers.keys()
                  var next
                  var obj = {}
                  while((next = keys.next()), !next.done){
                    obj[next.value] = res.headers.get(next.value)
                  }
                  return obj
                }(),
                ResponseBodyParsed: function () {
                  try {
                    return JSON.parse(text)
                  } catch (e) { }
                }()
              }, liEl)
            })

            return res
          })
          .catch(function (e) {
            addClass(liEl, 'error')
            liEl.innerHTML = ''
            printObj('', {
              __string__: '[' + method + '] (Failed) ' + url,
              RequestInit: options,
              Response: e.message,
            }, liEl)

            return Promise.reject(e)
          })

        return promise
      }
    }

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
            __string__: src
          }]
        } else {
          e.__string__ = e.message
          return [e]
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
    intercept()
    addClass(ConsoleEl, 'show')
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
  // console.show = true || 1 || 2
  var consoleShowValue = undefined
  Object.defineProperty(console, 'show', {
    configurable: true,
    set(value){
      consoleShowValue = value
      if (value) {
        intercept()
        setTimeout(function(){
          addClass(ConsoleEl, 'show')
          removeClass(ConsoleEl, 'open')
        })
      }
      if (value == 2) {
        setTimeout(function(){
          addClass(ConsoleEl, 'open')
        }, 100)
      }
      if (!value) {
        removeClass(ConsoleEl, 'show')
        removeClass(ConsoleEl, 'open')
      }
    },
    get(){
      return consoleShowValue
    }
  })

})()
