/*!
 * @preserve https://github.com/wusfen/console.js
 *
 * Console for mobile browser or webview
 */
!(function(window) {
  /**
   * do nothing
   */
  function noop() {}

  /**
   * childNodes => [childNode, ...]
   * @param {*} arrayLike
   */
  function toArray(arrayLike) {
    var arr = []
    var length = arrayLike.length
    while (length--) {
      arr[length] = arrayLike[length]
    }
    return arr
  }

  /**
   * null => null
   * undefined => undefined
   * 1 => Number
   * 'string' => String
   * <body> => Element
   * @param {*} obj
   * @returns {Function} constructor
   */
  function typeOf(obj) {
    if (obj instanceof Element) {
      return 'element'
    }
    return Object.prototype.toString
      .call(obj)
      .slice(8, -1)
      .toLowerCase()
  }

  /**
   * < => &lt;
   * > => &gt;
   * @param {string} html
   */
  function escapeTag(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  /**
   * parse html
   * @param {string} html
   * @returns {Element}
   */
  function parse(html) {
    var parseEl = (parse.el = parse.el || document.createElement('div'))
    parseEl.innerHTML = html
    var el = parseEl.children[0]
    el.isParse = true
    parseEl.removeChild(el) // - parentNode
    return el
  }

  /**
   * find element
   * @param {Elemnt} el parentElement
   * @param {string} name tagName || attrName
   * @returns {Element}
   */
  function find(el, name) {
    for (var i = 0; i < el.children.length; i++) {
      var childEl = el.children[i]

      if (name == childEl.tagName.toLowerCase()) return childEl
      if (hasAttribute(childEl, name)) return childEl

      var r = find(childEl, name)
      if (r) {
        return r
      }
    }
  }

  /**
   * (el, 'attr') => <el attr></el>
   * @param {Element} el
   * @param {string} attr
   */
  function setAttribute(el, attr) {
    attr.split(/\s+/).map((attr) => {
      el.setAttribute(attr, '')
    })
  }

  /**
   * <el attr></el> => <el></el>
   * @param {Element} el
   * @param {string} attr
   */
  function removeAttribute(el, attr) {
    el.removeAttribute(attr)
  }

  /**
   * <el attr></el> => true
   * @param {Element} el
   * @param {string} attr
   */
  function hasAttribute(el, attr) {
    return el.hasAttribute(attr)
  }

  /**
   * <el></el> => <el attr></el>
   * <el attr></el> => <el></el>
   * @param {Element} el
   * @param {string} attr
   */
  function toggleAttribute(el, attr) {
    if (hasAttribute(el, attr)) {
      removeAttribute(el, attr)
    } else {
      setAttribute(el, attr)
    }
  }
  /**
   * tween
   * @param {number} start
   * @param {number} end
   * @param {function} cb
   * @param {number?} duration
   */
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
  var htmlEl = document.documentElement
  var headEl = document.head

  var styleEl = parse(`
    <style>
      head{
        display: block;
      }
      console,
      box{
        box-sizing: border-box;
        display:block;
        font-size: 12px;
        font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
        line-height: 1.5;
        color: #333;
        text-align: left;
        cursor: default;
        transition: .3s, opacity .6s;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        -webkit-overflow-scrolling: touch;
        -webkit-text-size-adjust: none;
      }
      console *,
      box * {
        box-sizing: inherit;
        font: inherit;
        color: inherit;
        text-decoration: none;
        transition: inherit;
      }

      console {
        position: fixed;
        z-index: 999999995;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 1080px;
        height: 322px;
        height: 375px;
        margin: auto auto 0;
        text-shadow: 0px 1px 1px #fff;
        transition: .3s cubic-bezier(0, 0, .25, 1);
        transform: translate(0, 100%);
      }
      console[open] {
        max-height: calc(100vh - 30px);
        transition: .3s cubic-bezier(.25, 0, 1, 1);
        transform: translate(0, 0);
        box-shadow: rgba(125, 125, 125, 0.3) 0px 0 15px 0;
      }
      console[hidden]{
        display: none;
      }
      console main{
        height: 100%;
      }
      console [f12] {
        position: absolute;
        bottom: 100%;
        right: 1em;
        padding: 3px 6px 0;
        border: solid 1px #eee;
        border-bottom: 0;
        border-radius: 8px 8px 0 0;
        background: rgba(255, 255, 255, .8);
        box-shadow: 4px -4px 10px -4px rgba(0, 0, 0, 0.1);
      }
      console nav{
        display: flex;
        position: absolute;
        z-index: 9;
        top: 0;
        left: 0;
        right: 0;
        white-space: nowrap;
        overflow: auto;
        border-top: solid 1px rgba(255, 255, 255, 0.2);
        border-bottom: solid 1px rgba(200, 200, 200, 0.2);
        background: rgba(250, 250, 250, 0.5);
        -webkit-backdrop-filter: blur(1.5px);
        backdrop-filter: blur(1.5px);
      }
      console nav>*{
        padding: .25em .5em;
      }

      console ul {
        height: 100%;
        padding: 26px 0 4em;
        margin: 0;
        overflow: auto;
        list-style: none;
        background: rgba(255, 255, 255, 0.95);
      }
      console li {}
      console li > [map] {
        display: flex;
        align-items: start;
        padding: .25em;
        border-top: solid 1px rgba(255, 255, 255, 0.4);
        border-bottom: solid 1px rgba(200, 200, 200, 0.2);
        overflow: auto;
        white-space: nowrap;
      }
      console li > [map] > [key-value] {
        display: inline-block;
        vertical-align: top;
        padding: 0 .5em;
      }
      console li > [map] > [key-value]:nth-last-child(2) {flex: 1}

      console [ajax] {
        background: rgba(125, 255, 159, .1);
        color: #bbb;
      }
      console [log] {
        background: rgba(250, 250, 255, 0.1);
      }
      console [info] {
        background: rgba(125, 200, 255, 0.1);
        color: #0095ff;
      }
      console [warn] {
        background: rgba(255, 225, 125, 0.1);
        color: #FF6F00;
      }
      console [error] {
        background: rgba(255, 125, 125, 0.1);
        color: red;
      }
      console [success] {
        color: #00cc8a;
      }

      console [cmd] {
        position: relative;
        background: rgba(125, 243, 255, 0.1);
        color: #0af;
      }
      console [cmd] [key]:before {
        content: "$ ";
        position: absolute;
        left: 0;
        color: #ddd;
      }

      console [map] {}
      console [key-value] {white-space: nowrap}
      console [key] {color: #a71d5d}
      console [value] {}

      console [value][number] {color: #c000ff}
      console [value][string] {color: #666}
      console [value][boolean] {color: #ff0060}
      console [value][null] {color: #ccc}
      console [value][undefined] {color: #ccc}
      console [value][function] {color: #489ae0}
      console [value][htmldocument] {color: #a71d5d}
      console [value][element] {color: #a71d5d}
      
      console li > [map] > [key-value] > [string] {color: inherit}
      console [cmd] [value] {color: #0af}
      console [trace] > [value] {color: #ccc}


      console [htmldocument]:after,
      console [element]:after {content: ' ⇿'; color: #888}
      console [open] > [htmldocument]:after,
      console [open] > [element]:after {visibility: hidden}

      console [value] + [map] {
        max-width: 0;
        max-height: 0;
        padding-left: 1em;
        border-left: dotted 1px #ddd;
        overflow: hidden;
        opacity: 0;
        transition: .3s cubic-bezier(0, 1, 0, 1), opacity .6s;
      }
      console [key-value][open] > [map] {
        max-width: 59999px;
        max-height: 59999px;
        overflow: auto;
        opacity: 1;
        transition: .3s cubic-bezier(1, 0, 1, 0), opacity .6s;
      }
      console [key-value][open] > [value]:not([element]) { xxopacity: .5 }

      console [key-value][active] > [value]{
        xxcolor: #f0a;
        display: inline-block;
        vertical-align: top;
        max-width: calc(100vw - 2em);
        width: max-content;
        white-space: pre-wrap;
        word-break: break-word;
      }

      console textarea {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        line-height: 1.25;
        display: block;
        width: 100%;
        border: none;
        border-radius: 0;
        outline: none;
        height: 3em;
        padding: .25em 1em;
        resize: none;
        background: rgba(255, 255, 255, .6);
        -webkit-backdrop-filter: blur(1.5px);
        backdrop-filter: blur(1.5px);
        color: #333;
      }
      console [run]{
        position: absolute;
        bottom: 12px;
        right: 12px;
        padding: .25em 1em;
        border: solid 1px #bbb;
        border-radius: 5px;
        background: #fff;
        color: #bbb;
      }
      console textarea:focus {height: 8em}
      console textarea:invalid + [run] {opacity: 0}

      console ul + a{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        font-size: 1.5em;
        text-align: center;
        opacity: 0;
      }
      console ul:empty + a{
        opacity: .25;
        top: 48px;
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
      @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
        console ul {
          background: rgba(255, 255, 255, 0.9);
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
        }
      }
    </style>
  `)

  var consoleLink = `
  <a href="https://github.com/wusfen/console.js" target="_blank">
    console.js
    <svg style="height: 1em;width:1em;vertical-align:middle" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
      <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
  </a>
  `

  var consoleEl = parse(`
  <console>
    <key f12>F12</key>
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
        <b>dir($0)</b>
        ${consoleLink}
      </nav>
      <ul>
        <li>
          <div map>
            <div key-value>
              <span key> </span>
              <span value> </span>
              <div map></div>
            </div>
          </div>
        </li>
      </ul>
      ${consoleLink}
      <textarea placeholder="$" required></textarea>
      <button run>run</button>
    </main>
  </console>
  `)
  var f12El = find(consoleEl, 'key')
  var listEl = find(consoleEl, 'ul')
  var liEl = find(consoleEl, 'li')
  var keyValueEl = find(consoleEl, 'key-value')
  var inputEl = find(consoleEl, 'textarea')
  var runEl = find(consoleEl, 'run')
  var wordsEl = find(consoleEl, 'nav')

  var boxEl = parse(`
  <box>
    <style>
      box{
        display: block;
        position: absolute;
        left: -9em;
        top: -9em;
        z-index: 999999991;
        line-height: 1;
        opacity: 1;
        letter-spacing: -1px;
        pointer-events: none;
      }
      box[hide]{
        opacity: 0;
        display: none;
      }
      box[hide] path{
        display: none;
      }
      
      box margin,
      box border,
      box padding{
        display: block;
      }
      box margin{
        position: relative;
        border: solid 0 rgba(255, 125, 0, 0.1);
      }
      box border{
        width: 0;
        height: 0;
        border: solid 0 rgba(255, 200, 0, 0.1);
        outline: dashed 1px #f0a;
        outline-offset: -1px;
      }
      box padding{
        height: 100%;
        border: solid 0 rgba(125, 255, 125, 0.1);
      }
      box text{
        position: absolute;
        top: 0;
        right: 0;
        padding: 1px 3px;
        border-radius: 0 0 0 5px;
        background: rgba(0, 0, 0, .7);
        color: #fff;
        white-space: nowrap;
        animation: 4s box infinite;
      }
      box path{
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: -1px;
        padding: 1px 3px;
        border-radius: 0 5px 5px 5px;
        background: rgba(0, 0, 0, .7);
        color: #fff;
        white-space: normal;
        animation: 4s box infinite;

        xxposition: fixed;
        xxtop: 0;
        bottom: auto;
        padding: 0px 5px;
        margin-right: -5px;
        line-height: 18px;
        xxborder-radius: 0 0 5px 0;
        background: rgba(255, 255, 255, 0.7);
        color: #555;
        xxanimation: unset;
      }
      box path tag{
        color: #f0a;
      }
      @-webkit-keyframes box{
        0%,40%{
          opacity: 1;
        }
        20%{
          opacity: .1;
        }
      }
    </style>
    <margin>
      <border>
        <padding></padding>
      </border>
      <text></text>
      <path>
      </path>
    </margin>
  </box>
  `)
  var marginEl = find(boxEl, 'margin')
  var borderEl = find(boxEl, 'border')
  var paddingEl = find(boxEl, 'padding')
  var textEl = find(boxEl, 'text')
  var pathEl = find(boxEl, 'path')

  headEl.appendChild(styleEl)
  headEl.appendChild(consoleEl)
  headEl.appendChild(boxEl)

  // init
  listEl.innerHTML = ''
  listerBox()

  // print
  function printLi(type, valueList, trace) {
    // clone li
    var _liEl = liEl.cloneNode(true)
    var mapEl = find(_liEl, 'map')
    listEl.appendChild(_liEl)
    mapEl.innerHTML = ''
    setAttribute(_liEl, type)

    // log('%c...', 'style', ...)
    var obj0 = valueList[0]
    obj0 = obj0 && obj0.toString ? String(obj0) : '{}'
    var obj0m = obj0.match(/%c.+?(?=%c|$)+/g)
    if (obj0m) {
      for (var ci = 0; ci < obj0m.length; ci++) {
        printKeyValue(mapEl, '', obj0m[ci].slice(2)).setAttribute(
          'style',
          valueList[ci + 1]
        )
      }
      valueList = ['']
    }

    // log(a,b,...c)
    for (var i = 0; i < valueList.length; i++) {
      printKeyValue(mapEl, '', valueList[i], type)
    }

    // trace
    var objEl = printKeyValue(mapEl, '', trace || '')
    setAttribute(objEl, 'trace')

    // li max
    if (listEl.children.length > 500) {
      listEl.removeChild(listEl.children[0])
    }

    // scroll
    var isEnd =
      listEl.scrollTop + listEl.clientHeight > listEl.scrollHeight - 40
    if (isEnd) {
      scrollToEnd()
    }

    return _liEl
  }

  /**
   * li.map
   *  .key-value  .key-value
   *    .value
   *    .map
   *      .key-value
   *      .key-value
   *        .key
   *        .value
   *        .map
   *          .key-value
   *          .key-value
   * @param {Element} parentElement
   * @param {string} key
   * @param {string} value
   * @param {string} type
   */
  function printKeyValue(parentEl, key, value, type) {
    // skip
    if (value && value.isParse) {
      return
    }

    // clone keyValueEl
    var _keyValueEl = keyValueEl.cloneNode(true)
    var keyEl = find(_keyValueEl, 'key')
    var valueEl = find(_keyValueEl, 'value')
    var childrenEl = find(_keyValueEl, 'map')
    parentEl.appendChild(_keyValueEl)

    // key
    keyEl.key = key
    keyEl.innerText = key

    // value
    valueEl.value = value
    valueEl.innerHTML = escapeTag(toString(value))
    setAttribute(valueEl, typeOf(value))

    // children
    childrenEl.value = value

    // open children
    _keyValueEl.onclick = valueEl.onclick = function(e) {
      // self
      e.stopPropagation()

      clickValue(_keyValueEl, keyEl, valueEl, childrenEl, type)
    }

    return _keyValueEl
  }

  function printKeyValueList(parentEl, keyValueList, type) {
    var fragment = document.createDocumentFragment()
    keyValueList.forEach((keyValue) => {
      printKeyValue(fragment, keyValue.key, keyValue.value, type)
    })
    parentEl.appendChild(fragment)
  }

  // click obj: print children
  function clickValue(keyValueEl, keyEl, valueEl, childrenEl, type) {
    var parentEl = keyValueEl.parentNode
    var key = keyEl.key
    var value = valueEl.value

    // active
    toggleAttribute(keyValueEl, 'active')
    if (clickValue.lastEl && clickValue.lastEl != keyValueEl) {
      removeAttribute(clickValue.lastEl, 'active')
    }
    clickValue.lastEl = keyValueEl

    // function: call
    if (
      typeof value === 'function' &&
      key &&
      hasAttribute(keyValueEl, 'active')
    ) {
      // temp1
      console.temp1 = parentEl.value
      inputEl.value = `temp1.${key}('${
        /'(.*?)'/.test(inputEl.value)
          ? RegExp.$1
          : inputEl.value || 'click to input'
      }')`

      // call
      run()
      inputEl.value = ''

      return
    }

    // scrollTop
    setTimeout(() => {
      var ulRect = listEl.getBoundingClientRect()
      var objRect = keyValueEl.getBoundingClientRect()
      var diffTop = objRect.top - ulRect.top
      tween(
        listEl.scrollTop,
        listEl.scrollTop + diffTop - 26 * 2 - 4,
        (v) => (listEl.scrollTop = v)
      )
    }, 150)

    // scrollLeft
    setTimeout(() => {
      if (keyValueEl.offsetLeft < 50) return
      tween(
        parentEl.scrollLeft,
        keyValueEl.offsetLeft - 12 * 4,
        (v) => (parentEl.scrollLeft = v)
      )
    }, 150)

    // showBox
    if (value && value.tagName) {
      showBox(value, true)
    }

    // $n
    var $i = 10
    if (value instanceof Element) {
      while ($i--) {
        console['$' + $i] = console['$' + ($i - 1)]
      }
      console.$0 = value
    }

    // object children
    if (typeof value == 'object') {
      // toggle
      toggleAttribute(keyValueEl, 'open')

      // print children
      if (hasAttribute(keyValueEl, 'open')) {
        // reopen update
        childrenEl.innerHTML = ''

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
        var keyValueList = []
        for (var k in value) {
          keyValueList.push({
            key: k,
            value: value[k],
          })
          // max
          if (typeOf(value) == 'array' && k > 500) {
            keyValueList.push({
              key: '...',
              value: 'too max',
            })
            return
          }
        }
        printKeyValueList(childrenEl, keyValueList)
      }
    }
  }

  // touch||click||mouseover show box
  function listerBox() {
    if (!document.body) {
      setTimeout(() => {
        listerBox()
      }, 300)
      return
    }

    document.body.addEventListener('touchstart', (e) => {
      showBox(e.target)
    })
    document.body.addEventListener('click', (e) => {
      showBox(e.target)
    })
    document.body.addEventListener(
      'mouseover',
      (e) => {
        showBox(e.target)
      },
      true
    )

    // scroll update box pos
    var updateBoxTimer
    document.body.addEventListener(
      'scroll',
      (e) => {
        clearTimeout(updateBoxTimer)
        updateBoxTimer = setTimeout(() => {
          boxEl.target && showBox(boxEl.target)
        }, 300)
      },
      true
    )
  }

  // show element box
  function showBox(el, isNeedScroll) {
    // hide
    if (!hasAttribute(consoleEl, 'open')) {
      hideBox()
      return
    } else {
      boxEl.removeAttribute('hide')
    }

    boxEl.target = el

    var rootRect = htmlEl.getBoundingClientRect()
    var rect = el.getBoundingClientRect()
    var style = getComputedStyle(el)

    var marginLeft = parseFloat(style.marginLeft)
    var marginTop = parseFloat(style.marginTop)
    Object.assign(boxEl.style, {
      top: rect.top - rootRect.top - (marginTop < 0 ? 0 : marginTop) + 'px', // ? -margin
      left:
        rect.left - rootRect.left - (marginLeft < 0 ? 0 : marginLeft) + 'px',
    })
    Object.assign(marginEl.style, {
      borderLeftWidth: style.marginLeft,
      borderRightWidth: style.marginRight,
      borderTopWidth: style.marginTop,
      borderBottomWidth: style.marginBottom,
    })
    Object.assign(borderEl.style, {
      'border-width': style.borderWidth,
      width: rect.width + 'px',
      height: rect.height + 'px',
    })
    Object.assign(paddingEl.style, {
      'border-width': style.padding,
    })

    textEl.innerHTML = `${rect.width.toFixed(2)} x ${rect.height.toFixed(2)}`
    pathEl.innerHTML = getPath(el)

    // scrollIntoView
    if (isNeedScroll) {
      el.scrollIntoViewIfNeeded && el.scrollIntoViewIfNeeded()
      clearTimeout(showBox.timer)
      showBox.timer = tween(
        window.scrollY,
        rect.height >= window.innerHeight
          ? 0
          : rect.top -
              rootRect.top -
              (window.innerHeight - 320 - rect.height - 16 * 3),
        (v) => window.scrollTo(0, v)
      )
    }
  }

  // hide element box
  function hideBox() {
    boxEl.setAttribute('hide', true)
  }

  // value to print
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
      // !Object.create(null)?
      var v0Str = v0.toString ? String(v0).slice(0, 20) : '{…}'
      return `{ ${k0}: ${v0Str} …}`
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
      return `(${value.length})[${String(value[0]).slice(0, 20)} …]`
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

    // element
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

  // file.ext:line
  function getTrace(error) {
    var traceStart = 0
    if (!error) {
      try {
        throw new Error('trace')
      } catch (e) {
        error = e
        traceStart = 2
      }
    }

    /**
      @example:
      ReferenceError: fun is not defined
          at fn (http://172.20.10.6:5500/example/example.html:176:13)
          at http://172.20.10.6:5500/example/example.html:179:11
      =>
          at fn (http://172.20.10.6:5500/example/example.html:176:13)
          at http://172.20.10.6:5500/example/example.html:179:11
    */
    var trace = error.stack
      .replace(/^.*?Error.*\n/, '') // -line0
      .split(/\n/) // => array
      .slice(traceStart) // -line*2: new Error('trace')

    // reg:                   file.ext       ?query   :line :col  )
    var m = trace[0].match(/([^/?=&#:() ]+)(\?[^?]*?)?(:\d+)(:\d+)\)?$/)
    // file.ext:line
    trace.__string__ = m ? `${m[1]}${m[3]}` : trace[0]
    // trace._stack = error.stack // dev

    return trace
  }

  // `body div.container ul li img#id`
  function getPath(el) {
    var path = []

    function loop(el) {
      if (el && el.tagName && el != htmlEl) {
        var tagName = el.tagName.toLowerCase()
        var id = el.id
        var className = el.className
        className =
          typeof className == 'string'
            ? className
              .trim()
              .split(/\s+/)
              .join('.')
            : '' // svg className is object
        var selector = `
        <span style="white-space:nowrap">
          <tag>${tagName}</tag>${id ? '#' + id : ''}${
    className ? '.' + className : ''
  }
        </span>`
        path.push(selector)

        // too long
        // loop(el.parentNode)
      }
    }
    loop(el)

    return path.reverse().join(' ')
  }

  // to end
  function scrollToEnd() {
    tween(
      listEl.scrollTop,
      listEl.scrollTop + listEl.scrollHeight,
      (v) => (listEl.scrollTop = v)
    )
  }

  /**
   * run code
   *
   * @example
   * inputEl.value = 'value'
   * run()
   *
   * @returns result
   */
  function run() {
    var code = inputEl.value
    if (!code) return

    // print input
    var cmdLi = printLi('cmd', [code])

    // click to input again
    cmdLi.code = code
    cmdLi.addEventListener(
      'click',
      function() {
        inputEl.value = cmdLi.code
        inputEl.focus()
        inputEl.setSelectionRange(99, 99)
      },
      true
    )

    // scroll
    scrollToEnd()

    // exec
    code = /^\s*{/.test(code) ? '(' + code + ')' : code // ({})
    code = /^await/.test(code) ? `(async()=>{console.log(${code})})()` : code // await 1
    code = `with(console){${code}}` // dir(obj)
    var rs = window.eval(code)

    // print
    if (rs && rs.then) {
      // promise
      rs.then((v) => {
        console.log('await', rs)
        console.log(v)
      })
    } else {
      console.log(rs)
    }

    return rs
  }

  // run button
  runEl.onclick = function() {
    run()
    inputEl.value = ''
  }

  // words
  wordsEl.onclick = function(e) {
    var b = e.target
    if (!/b/i.test(b.tagName)) return
    var code = b.innerHTML

    // clear
    if (/clear/.test(code)) {
      if (inputEl.value) {
        inputEl.value = ''
      } else {
        listEl.innerHTML = ''
      }
      return
    }

    // run
    var oldValue = inputEl.value
    inputEl.value = code
    run()
    inputEl.value = oldValue
  }

  // console toggle
  f12El.onclick = function() {
    if (console.show == 2) {
      console.show = 1
    } else {
      console.show = 2
    }
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
      debug: noop,
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
          try {
            printLi(type, arguments, getTrace())
          } catch (error) {
            console.warn('[console.js error]', error)
          }
        }
      })(type)
    }
    // avoid cover
    var consoleX = Object.assign({}, console)
    setTimeout(() => {
      Object.assign(console, consoleX)
    }, 1)

    // intercept error
    addEventListener(
      'error',
      function(e) {
        printLi('error', [e], e.error ? getTrace(e.error) : '')

        // auto open console
        if (console.show === 1) {
          console.show = 2
        }
      },
      true // true: catch (js, css, img) error
    )

    // intercept Uncaught (in promise)
    addEventListener('unhandledrejection', function(e) {
      e.__string__ = 'Uncaught (in promise) ' + e.reason
      printLi('error', [e])
    })

    // intercept xhr
    var XHR = window.XMLHttpRequest || noop
    var XHROpen = XHR.prototype.open
    var XHRSend = XHR.prototype.send
    XHR.prototype.open = function(method, url) {
      url = String(url)
      var xhr = this

      // open
      XHROpen.apply(this, arguments)

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
        var liEl = printLi('ajax', [
          {
            __string__: `[${method}] (pending) ${subUrl}`,
            url,
            requestBody,
            xhr,
          },
        ])
        var trace = getTrace()
        var startTime = new Date()

        // onloadend
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
                  try {
                    var response = xhr.response || xhr.responseText
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

        // // setTimeout: xhr.send(); xhr.onreadystatechange
        // if (!onreadystatechange) {
        //   setTimeout(function() {
        //     onreadystatechange = xhr.onreadystatechange
        //     xhr.onreadystatechange = readystatechange
        //   }, 0)
        // } else {
        //   xhr.onreadystatechange = readystatechange
        // }
        xhr.addEventListener('loadend', readystatechange)

        // send
        XHRSend.apply(this, arguments)
      }
    }

    // intercept fetch
    var _fetch = window.fetch
    if (_fetch && !/XMLHttpRequest/.test(_fetch)) {
      // !xhr polyfill
      window.fetch = function(url) {
        url = String(url)

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
      fetch._fetch = _fetch
    }

    // nav
    console.storage = {
      localStorage: localStorage,
      sessionStorage: sessionStorage,
      'document.cookie': document.cookie,
    }
    console.temp1 = document
    console.$0 = document
  }

  // toggle style
  headEl.appendChild(
    parse(`
  <style console>
    html{
      padding-bottom: 0;
      transition: .3s;
    }
    box{
      padding-bottom: 24px;
    }
  </style>
  `)
  )
  var consoleOpenStyle = parse(`
  <style console open>
    html{
      padding-bottom: 322px;
    }
    box{
      padding-bottom: calc(375px + 22px);
    }
  </style>
  `)

  // console.show = true || 1 || 2
  var consoleShow = console.show
  Object.defineProperty(console, 'show', {
    configurable: true,
    set(value) {
      consoleShow = value
      consoleOpenStyle.parentNode && headEl.removeChild(consoleOpenStyle)

      if (value) {
        intercept()
        removeAttribute(consoleEl, 'hidden')
        removeAttribute(consoleEl, 'open')
      }
      if (value == 2) {
        setTimeout(function() {
          setAttribute(consoleEl, 'open')
          headEl.appendChild(consoleOpenStyle)
        }, 100)
      }
      if (!value) {
        removeAttribute(consoleEl, 'open')
        setAttribute(consoleEl, 'hidden')
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
