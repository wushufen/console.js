# console.js
移动端浏览器webview调试控制台


## 用法
1. 引入 [console.js](https://cdn.jsdelivr.net/gh/wusfen/console.js@0.0.7/dist/console.js)  
```html
<script src="https://cdn.jsdelivr.net/gh/wusfen/console.js@0.0.7/dist/console.js"></script>
```
2. 开启
  * 方式一：在`url`上加上`#f12`即可开启
```css
http://domain.com/usage.html#f12
```
  * 方式二：通过代码打开
```javascript
console.show = 1 // 右下角显示f12，点击展开
console.show = 2 // 显示并展开
```
3. OK完成，就是这么简单


## 演示
https://wusfen.github.io/console.js/example/example.html
<!-- ![console](https://cdn.jsdelivr.net/gh/wusfen/console.js@0.0.7/example/example.png)   -->
![console](https://cdn.jsdelivr.net/gh/wusfen/console.js@0.0.7/example/console.js.png)  


## 注意
hash路由可用以下代替
```javascript
url#/route#f12    url?f12    url?k=v&f12
 ```

## 动态引入
1. 同步方式
```javascript
!function(){
  document.write('<script src=https://cdn.jsdelivr.net/gh/wusfen/console.js@0.0.7/dist/console.js><\/script>')
  document.write('<script> console.show=2 <\/script>')
}()
```
2. 异步方式
```javascript
!function(){
  var s=document.createElement('script')
  s.src = 'https://cdn.jsdelivr.net/gh/wusfen/console.js@0.0.7/dist/console.js'
  s.onload = function(){ console.show = 2 }
  document.body.appendChild(s)
}()
```
