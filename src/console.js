/*!
 * @preserve https://github.com/wusfen/console.js
 *
 * #f12 开启 Console控制台
 *
 * hash路由可用以下代替
 * url#/route#f12    url?f12    url?k=v&f12
 */
!(function(window) {
  var noop = function() {}

  var toArray = function(arrayLike) {
    var arr = []
    var length = arrayLike.length
    while (length--) {
      arr[length] = arrayLike[length]
    }
    return arr
  }

  var typeOf = function(obj) {
    if (obj instanceof Element) {
      return 'element'
    }
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  }

  var escapeTag = function(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  var parse = function(html) {
    var el = (parse.el = parse.el || document.createElement('div'))
    el.innerHTML = html
    return el.children[0]
  }

  var find = function(el, selector) {
    for (var i = 0; i < el.children.length; i++) {
      var child = el.children[i]
      if (
        selector == child.className ||
        selector == child.tagName.toLowerCase()
      ) {
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
    if (!hasClass(el, className)) {
      el.className += ' ' + className
    }
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

  function tween(start, end, cb, duration = 500) {
    var times = duration / 15
    var step = (end - start) / times
    var i = 0
    var timer = setInterval(() => {
      start += step
      if (++i >= times) {
        start = end
        clearInterval(timer)
      }
      cb(start)
    }, 15)
    return timer
  }

  // view
  var ConsoleEl = parse(`
  <console>
    <style>
      html {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100vh;
      }
      console {
        display:block;
        z-index: 999999999;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 768px;
        margin: auto auto 0;
        font-size: 12px;
        font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
        line-height: 1.5;
        color: #333;
        box-shadow: rgba(125, 125, 125, 0.3) 0px 0 15px 0;
        text-align: left;
        cursor: default;
        text-shadow: 0px 1px 1px #fff;
        touch-action: manipulation;
        -webkit-overflow-scrolling: touch;
        -webkit-text-size-adjust: none;
      }
      console key {
        position: absolute;
        bottom: 100%;
        right: 1em;
        padding: 2px 5px;
        border: solid 1px #eee;
        border-bottom: 0;
        border-radius: 5px 5px 0 0;
        background: rgba(255, 255, 255, .8);
        box-shadow: rgba(0, 0, 0, 0.1) 4px -4px 10px -4px;
        color: #555;
        cursor: pointer;
      }
      console main{
        display: block;
        position: relative;
        height: 322px;
        max-height: calc(100vh - 30px);
        transition: .3s cubic-bezier(.25, 0, 1, 1);
      }
      console.hidden {
        display: none;
      }
      console.closed main {
        max-height: 0;
        overflow: hidden;
        transition: .3s cubic-bezier(0, 0, .25, 1);
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
        transition: .3s, opacity .6s;
      }
      console nav{
        display: flex;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        white-space: nowrap;
        overflow: auto;
        border-top: solid 1px rgba(255, 255, 255, 0.2);
        border-bottom: solid 1px rgba(200, 200, 200, 0.2);
        background: rgba(250, 250, 250, 0.8);
        color: #333;
        -webkit-backdrop-filter: blur(1.5px);
        backdrop-filter: blur(1.5px);
      }
      console nav>*{
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
        background: rgba(255, 255, 255, 0.95);
      }
      console ul li {
        display: flex;
        align-items: start;
        padding: .25em;
        border-top: solid 1px rgba(255, 255, 255, 0.4);
        border-bottom: solid 1px rgba(200, 200, 200, 0.2);
        overflow: auto;
        white-space: nowrap;
      }
      console .log {
        background: rgba(250, 250, 255, 0.1);
      }
      console .info {
        color: #0095ff;
        background: rgba(125, 200, 255, 0.1);
      }
      console .warn {
        color: #FF6F00;
        background: rgba(255, 225, 125, 0.1);
      }
      console .error {
        color: red;
        background: rgba(255, 125, 125, 0.1);
      }
      console .ajax {
        background: rgba(125, 200, 125, 0.1);
        background: rgba(125, 243, 255, 0.1);
      }
      console .success {
        color: #0d0;
        color: #00ccee;
      }
      console .cmd {
        position: relative;
        background: rgba(255, 255, 255, 0.1);
      }
      console .cmd .key:before {
        content: "$ ";
        position: absolute;
        left: 0;
        color: #ddd;
      }
      console li>.obj {
        display: inline-block;
        vertical-align: top;
        padding: 0 .5em;
      }
      console .obj {
        white-space: nowrap;
      }
      console .key {
        color: #a71d5d;
      }
      console .value {}
      console .number>.value { color: #5b00ff }
      console .string>.value { color: #666 }
      console li>.string>.value{ color: inherit }
      console .boolean>.value { color: #ff0060 }
      console .null>.value { color: #ccc }
      console .undefined>.value { color: #ccc }
      console .function>.value { color: #489ae0 }
      console .htmldocument>.value,
      console .element>.value { color: #a71d5d }
      console .cmd .value{ color: #0af}
      console .htmldocument>.value:after,
      console .element>.value:after {
        content: ' ⇿';
      }
      console .htmldocument.open>.value:after,
      console .element.open>.value:after {
        visibility: hidden;
      }
      console .obj.open>.value {
        display: inline-block;
        vertical-align: top;
        max-width: calc(100vw - 2em);
        width: max-content;
        white-space: pre-wrap;
        word-break: break-word;
      }
      console :not(.ajax)>.object.open>.value {
        opacity: .1;
      }
      console .obj.current>.value{
        color: #ff00bc;
      }
      console .children {
        max-width: 0;
        max-height: 0;
        padding-left: 1em;
        border-left: dotted 1px #ddd;
        overflow: hidden;
        opacity: 0;
        transition: .3s cubic-bezier(0, 1, 0, 1), opacity .6s;
      }
      console .open>.children {
        max-width: 59999px;
        max-height: 59999px;
        overflow: auto;
        opacity: 1;
        transition: .3s cubic-bezier(1, 0, 1, 0), opacity .6s;
      }
      console textarea {
        line-height: 1.25;
        display: block;
        width: 100%;
        border: none;
        border-radius: 0;
        outline: none;
        height: 3em;
        padding: .25em 1em;
        resize: none;
        position: relative;
        background: rgba(255, 255, 255, .6);
        -webkit-backdrop-filter: blur(1.5px);
        backdrop-filter: blur(1.5px);
        color: #333;
      }

      console li>.obj:nth-last-child(2) { flex: 1 }
      console .obj.trace>.value { color: #ccc }

      @supports (position: sticky){
        console {
          position: sticky
        }
      }
      @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
        console ul {
          background: rgba(255, 255, 255, 0.8);
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
        }
      }
    </style>
    <key>F12</key>
    <main>
      <nav>
        <b>clear</b>
        <b>location</b>
        <b>document</b>
        <b>storage</b>
        <b>window</b>
        <b>screen</b>
        <b>navigator</b>
        <b>history</b>
        <b>performance</b>
        <a href="https://github.com/wusfen/console.js" target="_blank">
          <svg style="height: 1em;width:1em;vertical-align:middle" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          console.js
        </a>
      </nav>
      <ul>
        <li>
          <div class="obj">
            <span class="key"></span>
            <span class="value"></span>
            <div class="children"></div>
          </div>
        </li>
      </ul>
      <textarea placeholder="$"></textarea>
    </main>
  </console>
  `)
  var F12El = find(ConsoleEl, 'key')
  var MainEl = find(ConsoleEl, 'main')
  var UlEl = find(ConsoleEl, 'ul')
  var LiEl = find(ConsoleEl, 'li')
  var ObjEl = find(ConsoleEl, 'obj')
  var InputEl = find(ConsoleEl, 'textarea')
  var WordsEl = find(ConsoleEl, 'nav')

  // init clear
  UlEl.innerHTML = ''

  // console toggle
  F12El.onclick = function() {
    toggleClass(ConsoleEl, 'closed')
  }

  // print
  var printLi = function(type, valueList, trace) {
    // is scroll end
    var isEnd = UlEl.scrollTop + UlEl.clientHeight > UlEl.scrollHeight - 40

    // clone li
    var liEl = LiEl.cloneNode(true)
    addClass(liEl, type)
    liEl.innerHTML = ''
    UlEl.appendChild(liEl)

    // log('%c...', 'style', ...)
    var obj0 = valueList[0] + ''
    var obj0m = obj0.match(/%c.+?(?=%c|$)+/g)
    if (obj0m) {
      for (var ci = 0; ci < obj0m.length; ci++) {
        printKeyValue(liEl, '', obj0m[ci].slice(2)).setAttribute(
          'style',
          valueList[ci + 1]
        )
      }
      valueList = ['']
    }

    // log(a,b,...c)
    for (var i = 0; i < valueList.length; i++) {
      printKeyValue(liEl, '', valueList[i], type)
    }

    // trace
    var objEl = printKeyValue(liEl, '', trace || '')
    addClass(objEl, 'trace')

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

  /**
   * li
   *  .key-value  .key-value
   *    .value
   *    .sub.obj
   *      .key-value
   *      .key-value
   *        .key
   *        .value
   *        .sub.obj
   *          .key-value
   *          .key-value
   * @param {*} parentElement
   * @param {*} key
   * @param {*} value
   * @param {*} type
   */
  var printKeyValue = function(parentElement, key, value, type) {
    // clone objEl
    var objEl = ObjEl.cloneNode(true) // key-value
    var keyEl = find(objEl, 'key')
    var valueEl = find(objEl, 'value')
    var childrenEl = find(objEl, 'children')
    parentElement.appendChild(objEl)

    // key
    keyEl.innerText = key

    // value
    valueEl.innerHTML = escapeTag(toString(value))
    addClass(objEl, typeOf(value))

    // save
    childrenEl.value = value

    // open children
    objEl.onclick = valueEl.onclick = function(e) {
      clickValue(parentElement, key, value, type, objEl, valueEl, childrenEl, e)
    }

    return objEl
  }

  // click obj: print children
  function clickValue(
    parentElement,
    key,
    value,
    type,
    objEl,
    valueEl,
    childrenEl,
    e
  ) {
    // function call
    if (typeof value === 'function') {
      try {
        console.log(
          'call:',
          value.call(parentElement.value),
          '<=',
          value,
          'by',
          parentElement.value
        )
      } catch (e) {}
    }

    // toggle
    toggleClass(objEl, 'open')
    clickValue.objEl && removeClass(clickValue.objEl, 'current')
    clickValue.objEl = objEl
    addClass(objEl, 'current')

    // scrollLeft
    setTimeout(() => {
      if (objEl.offsetLeft < 50) return
      tween(
        parentElement.scrollLeft,
        objEl.offsetLeft,
        (v) => (parentElement.scrollLeft = v)
      )
    }, 150)
    // scrollTop
    setTimeout(() => {
      var ulRect = UlEl.getBoundingClientRect()
      var objRect = objEl.getBoundingClientRect()
      var diffTop = objRect.top - ulRect.top
      tween(
        UlEl.scrollTop,
        UlEl.scrollTop + diffTop - 26 * 2 - 4,
        (v) => (UlEl.scrollTop = v)
      )
    }, 150)

    // showElementBox
    if (value && value.tagName) {
      showElementBox(value)
    }

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
        printKeyValue(childrenEl, '', childNode)
      }
      return
    }

    // keys
    for (var k in value) {
      printKeyValue(childrenEl, k, value[k])
      // max
      if (typeOf(value) == 'array' && k > 500) {
        printKeyValue(childrenEl, '...', '')
        return
      }
    }
  }

  // show element box
  function showElementBox(el, isNoScroll) {
    var htmlEl = document.documentElement
    if (!showElementBox.box) {
      showElementBox.box = document.createElement('div')
      htmlEl.appendChild(showElementBox.box)
      addEventListener(
        'scroll',
        (e) => {
          showElementBox(showElementBox.el, true)
        },
        true
      )
    }
    showElementBox.el = el
    var box = showElementBox.box

    var rootRect = htmlEl.getBoundingClientRect()
    var rect = el.getBoundingClientRect()
    var style = getComputedStyle(el)
    box.setAttribute(
      'style',
      `
      position: absolute;
      top: ${rect.top - rootRect.top}px;
      left: ${rect.left - rootRect.left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: dashed 1px #f0c;
      box-sizing: border-box;
      z-index: 999999998;
      pointer-events: none;
      transition: ${isNoScroll ? 0 : 0.5}s;
      transition-property: top, left, width, height;
      font-size: 12px;
      color: #f0c;
      text-shadow: 1px 1px 1px #bbb;
      white-space: nowrap;
      text-align: right;
    `
    )
    box.innerHTML = `
      <p style="
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: 0;
        border: solid 0 rgba(200, 255, 200, 0.5);
        border-width: ${style.padding};
      "></p>
      <span style="position:relative">
        ${rect.width.toFixed(2)} x ${rect.height.toFixed(2)}
      </span>
    `

    // scrollIntoView
    if (!isNoScroll) {
      el.scrollIntoViewIfNeeded()
      clearTimeout(showElementBox.timer)
      showElementBox.timer = tween(
        window.scrollY,
        rect.top - rootRect.top - 100,
        (v) => window.scrollTo(0, v)
      )
    }
  }

  // file.ext:line
  function getTrace() {
    try {
      throw new Error('trace')
    } catch (e) {
      var trace = e.stack
        .replace(/^Error.*\n/, '')
        .split(/\n/)
        .slice(2)
        .concat('trace') // !ios: -Error... => []
      var m = trace[0].match(/([^/?=&#:() ]+)(\?[^?]*?)?(:\d+)(:\d+)\)?$/) // file.ext?query:line:column  |  ..)?
      trace.__string__ = m ? `${m[1]}${m[3]}` : trace[0]
      return trace
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
      return `{ ${k0}: ${String(v0).slice(0, 15)} …}`
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

    // comment
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
    cmdLi.addEventListener(
      'click',
      function() {
        InputEl.value = cmdLi.code
      },
      true
    )

    // scroll
    setTimeout(function() {
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
  InputEl.onkeydown = function(event) {
    var code = InputEl.value

    // br
    if (event.keyCode == 13 && code.match(/[[{(,;]$/)) {
      return
    }
    // clear
    if (event.keyCode == 13 && code === '') {
      UlEl.innerHTML = ''
      return false
    }
    // run
    if (event.keyCode == 13) {
      run()
      return false
    }
  }
  InputEl.onblur = function(event) {
    run()
  }

  // words
  WordsEl.onclick = function(e) {
    var b = e.target
    if (!/b/i.test(b.tagName)) return

    InputEl.value = b.innerHTML
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
    var _console = Object.assign({}, window.console)

    // intercept console
    for (var type in con) {
      !(function(type) {
        console[type] = function() {
          _console[type].apply(this, arguments)
          printLi(type, arguments, getTrace())
        }
      })(type)
    }

    // intercept error
    addEventListener(
      'error',
      function(e) {
        printLi('error', [e])
        // true: catch (js, css, img) error
      },
      true
    )

    // intercept xhr
    var XHR = window.XMLHttpRequest || noop
    var XHRopen = XHR.prototype.open
    var XHRsend = XHR.prototype.send
    XHR.prototype.open = function(method, url) {
      var xhr = this
      // open
      XHRopen.apply(this, arguments)

      // setRequestHeader
      var requestHeaders = {}
      var setRequestHeader = xhr.setRequestHeader
      xhr.setRequestHeader = function(key, value) {
        requestHeaders[key] = value
        setRequestHeader.apply(this, arguments)
      }

      // send
      xhr.send = function(requestBody) {
        // pending
        var subUrl = url.split(/\/(?=[^/]+\/[^/]+$)/)[1] || url // last2/last1?query
        var liEl = printLi('ajax warn', [
          {
            __string__: `[${method}] (pending) ${subUrl}`,
            url,
            requestBody,
            xhr,
          },
        ])
        var trace = getTrace()
        var startTime = new Date()

        // onload
        var onreadystatechange = xhr.onreadystatechange
        function readystatechange(e) {
          onreadystatechange && onreadystatechange.apply(xhr, arguments)
          if (xhr.readyState != 4) return
          var endTime = new Date()
          var time = endTime - startTime
          var status = xhr.status
          var logType = /^(2..|304)$/.test(status)
            ? 'ajax success'
            : 'ajax error'

          var liEl2 = printLi(
            logType,
            [
              {
                __string__: `[${method}] (${status}) ${time}ms ${subUrl}`,
                url,
                requestHeaders,
                requestBody: (function() {
                  requestBody = decodeURIComponent(requestBody)
                  try {
                    return JSON.parse(requestBody)
                  } catch (e) {}
                  return requestBody
                })(),
                xhr,
                responseHeaders: xhr.getAllResponseHeaders(),
                responseBody: (function() {
                  var response = xhr.response || xhr.responseText
                  try {
                    return JSON.parse(response)
                  } catch (e) {}
                  return response
                })(),
              },
            ],
            trace
          )
          liEl.parentNode.replaceChild(liEl2, liEl)
        }

        // setTimeout: xhr.send(); xhr.onreadystatechange
        if (!onreadystatechange) {
          setTimeout(function() {
            onreadystatechange = xhr.onreadystatechange
            xhr.onreadystatechange = readystatechange
          }, 0)
        } else {
          xhr.onreadystatechange = readystatechange
        }

        // send
        XHRsend.apply(this, arguments)
      }
    }

    // intercept fetch
    var _fetch = window.fetch
    if (_fetch) {
      window.fetch = function(url) {
        // pending
        var subUrl = url.split(/\/(?=[^/]+\/[^/]+$)/)[1] || url // last2/last1?query
        var requestInit = arguments[1] || ''
        var method = requestInit.method || 'GET'
        var liEl = printLi('ajax', [
          {
            __string__: `[${method}] (pending) ${subUrl}`,
            url,
            requestInit,
          },
        ])
        var trace = getTrace()
        var startTime = new Date()

        // apply
        var promise = _fetch
          .apply(this, arguments)
          .then(function(res) {
            var endTime = new Date()
            var time = endTime - startTime
            var status = res.status
            var logType = /^(2..|304)$/.test(status)
              ? 'ajax success'
              : 'ajax error'

            // end
            res
              .clone()
              .text()
              .then(function(text) {
                var liEl2 = printLi(
                  logType,
                  [
                    {
                      __string__: `[${method}] (${status}) ${time}ms ${subUrl}`,
                      url,
                      requestInit,
                      response: res,
                      responseHeaders: (function() {
                        var keys = res.headers.keys()
                        var next
                        var obj = {}
                        while (((next = keys.next()), !next.done)) {
                          obj[next.value] = res.headers.get(next.value)
                        }
                        return obj
                      })(),
                      responseBody: (function() {
                        try {
                          return JSON.parse(text)
                        } catch (e) {}
                        return text
                      })(),
                    },
                  ],
                  trace
                )
                liEl.parentNode.replaceChild(liEl2, liEl)
              })

            return res
          })
          .catch(function(e) {
            var liEl2 = printLi(
              'ajax error',
              [
                {
                  __string__: `[${method}] (Failed) ${subUrl}`,
                  url,
                  requestInit,
                  response: e.message,
                },
              ],
              trace
            )
            liEl.parentNode.replaceChild(liEl2, liEl)

            return Promise.reject(e)
          })

        return promise
      }
    }

    // nav
    console.storage = {
      localStorage: localStorage,
      sessionStorage: sessionStorage,
      'document.cookie': document.cookie,
    }
    console.temp1 = document
    console.$0 = document.body

    // insert ConsoleEl
    setTimeout(function() {
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
        setTimeout(function() {
          removeClass(ConsoleEl, 'hidden')
          addClass(ConsoleEl, 'closed')
        })
      }
      if (value == 2) {
        setTimeout(function() {
          removeClass(ConsoleEl, 'closed')
        }, 100)
      }
      if (!value) {
        addClass(ConsoleEl, 'hidden')
      }
    },
    get() {
      return consoleShow
    },
  })
  if (consoleShow) {
    console.show = consoleShow
  }
  // mobile
  if (navigator.userAgent.match(/mobile/i)) {
    intercept()
  }
  // pc when #f12
  if (location.href.match(/[?&#]f12\b/)) {
    console.show = 1
  }
  // #f12
  addEventListener('hashchange', function(e) {
    if (location.hash.match(/#f12\b/)) {
      console.show = 1
    } else {
      // console.show = 0
    }
  })
})(window)
