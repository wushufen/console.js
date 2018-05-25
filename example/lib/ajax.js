/**
 * https://github.com/wusfen/ajax.js
 * wushufen 20171228~20180516
 */
!(function() {
    if (!window.XMLHttpRequest) {
        window.XMLHttpRequest = function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }
    }

    var noop = function () {}

    var setting = {
        base: '',
        url: '',
        type: 'get',
        data: {},
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        async: true,
        cache: false,
        mock: false,
        before: noop,
        after: noop,
        success: noop,
        error: noop
    }

    // webpack 中 typeof+module.exports 会报错
    // https://github.com/webpack/webpack/issues/7318
    var _typeof = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    }

    var extend = function (obj, _obj) {
        for(var key in _obj){
            var val = obj[key]
            var _val = _obj[key]
            if (_typeof(_val) == 'object') {
                obj[key] = extend(val?val:{}, _val)
            }else{
                obj[key] = _obj[key]
            }
        }
        return obj
    }

    function ajax(options) {
        var _setting = extend({}, setting)
        options = extend(_setting, options)
        options.type = options.type.toUpperCase()
        ajax.options = options

        // before
        if (options.before(xhr, options)) {
            return
        }

        // data
        var data = options.data
        var kvs = []
        data._t_ = + new Date
        for (var key in data) {
            kvs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        }
        options.dataStr = kvs.join('&') // key=value&key2=value2

        // href
        options.href = options.url
        if (options.base && !options.url.match('://')) {
            options.href = options.base + '/' + options.url
        }
        if (options.type == 'GET') {
            options.href = options.href + '?' + options.dataStr
        }


        // xhr
        var xhr = new XMLHttpRequest
        ajax.xhr = xhr

        // handle
        xhr.onreadystatechange = function() {
            // console.log(xhr.readyState, xhr.status, xhr.responseText)
            if (xhr.readyState != 4) return

            // success
            if (xhr.status == 0 || xhr.status == 200 || xhr.status == 304) {

                // res
                var res = xhr.responseText
                try { res = JSON.parse(res) } catch (e) {}
                ajax.res = res

                // after
                if(options.after(xhr, options, res)){
                    return
                }
                options.success(res)

            }
            // error
            else {

                // after
                if (options.after(xhr, options, '')) {
                    return
                }
                options.error(xhr)

            }
        }

        // send
        xhr.open(options.type, options.href, options.async)
        for(var key in options.headers){
            xhr.setRequestHeader(key, options.headers[key])
        }
        xhr.send(options.type == 'POST' ? options.dataStr : null)

        return xhr
    }

    ajax.setting = setting
    ajax.post = function(options) {
        options.type = 'POST'
        return ajax(options)
    }
    ajax.get = function(options) {
        options.type = 'GET'
        return ajax(options)
    }
    ajax.setUp = function (options) {
        return extend(setting, options)
    }

    // export
    window.ajax = ajax
})();