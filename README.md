# console.js

Console for mobile browser or webview

## Features

- console logs
- log's traces
- document tree
- show element's box and path
- storages (localStorage, sessionStorage, document.cookie)
- ajax (xhr, fetch)
- runtime errors
- resource errors
- uncaught promises
- window, screen, navigator, history
- run js
- $0, ..., $9 (click element)
- temp1 (click object)
- call function (click function)
- input again (click code)
- print promise (auto await)

## USAGE

1. install

```html
<script src="https://cdn.jsdelivr.net/gh/wusfen/console.js@master/dist/console.js"></script>
```

2. open

- by url: `?f12 &f12 #f12`

```
http://domain.com/usage.html#f12
```

- by code

```javascript
console.f12 = 1 // show [f12] button
console.f12 = 2 // open console view
```

## PREVIEW

https://wushufen.github.io/console.js/example/example.html

![console](https://cdn.jsdelivr.net/gh/wushufen/console.js@master/example/console.js.png)

## INSTALL BY JS

```javascript
!(function () {
  if (/[?&#]f12\b/.test(location.href)) {
    // sync
    document.write(
      '<script f12 src=https://cdn.jsdelivr.net/gh/wushufen/console.js@master/dist/console.js></script>'
    )

    // async
    if (!document.querySelector('[f12]')) {
      var s = document.createElement('script')
      s.src =
        'https://cdn.jsdelivr.net/gh/wushufen/console.js@master/dist/console.js'
      document.body.appendChild(s)
    }
  }
})()
```

<!-- https://purge.jsdelivr.net/gh/wushufen/console.js@master/dist/console.js -->
