// view
var wrapEl = document.createElement('div');
setTimeout(function() {
    document.body.appendChild(wrapEl);
}, 10);
wrapEl.innerHTML = '<style type="text/css"> .console {font-size: 12px; font-family: "微软雅黑"; position: fixed; bottom: 0; right: 0; width: 100%; max-width: 100%; background: rgba(255, 255, 255, .6); box-shadow: 0 0 10px 10px rgba(169, 163, 163, 0.06); text-shadow: 1px 1px 2px rgb(77, 150, 255); } .list {max-height: 250px; overflow: auto; padding-right: 16px; width: 100%; } .list pre {margin: 0; border-bottom: solid 1px #eee; margin-bottom: -1px; padding: 6px; } textarea {display: block; width: 100%; border: none; border-top: solid 1px #ccc; outline: none; } </style> <div class="console"> <div id="consoleListId" class="list"> </div> <textarea onkeyup="exe(this, event)"></textarea> </div> ';

// log
function log(obj) {
    var rowEl = document.createElement('pre');
    var str = stringify(obj);
    rowEl.innerHTML = str.replace(/\n/g, '<br>');
    consoleListId.appendChild(rowEl);
    consoleListId.scrollTop = 999999;
    // alert(stringify(obj));
}

// stringify
function stringify(obj, n) {
    n = n || 0;
    if (n > 9) {
        return '...'
    }

    if (Object.prototype.toString.call(obj) == "[object Array]") {
        var str = '['
        for (var i = 0; i < obj.length; i++) {
            str += stringify(obj[i]) + ', ';
        }
        str = str.replace(/, $/, '');
        str += ']';
        return str;
    }
    if (typeof obj == 'object') {
        var str = '{\n';
        var _obj = {};
        for (var i = 0; i < (obj||{}).length; i++) { // for ie
            var item = obj[i];
            if (item !== undefined) {
                _obj[i] = item;
            }
        }
        for (var i in obj) {
            _obj[i] = obj[i];
        }
        for (var i in _obj) {
            str += Array(n + 2).join('　') + '"' + i + '": ' + stringify(_obj[i], n + 1) + ',\n';
        }
        str = str.replace(/,\n$/, '');
        str += '\n' + Array(n + 1).join('　') + '}';
        return str;
    }

    if (typeof obj == 'string') {
        return '"' + obj + '"';
    }

    return obj + '';

}

// exe js
function exe(inputEl, event) {
    if (event.keyCode != 13) return;

    var code = inputEl.value;
    var code = code.match(/^\s*{/) ? '(' + code + ')' : code;
    console.log(window.eval(code));
    inputEl.value = '';
}

// catch error
onerror = function() {
    console.log(arguments)
}


// console
var winConsole = window.console || { log: function() {} };
var console = {
    log: function(argument) {
        winConsole.log(argument)
        log(argument)
    }
};
