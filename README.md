# console.js
移动端浏览器webview调试控制台


## 用法
1. 引入 [console.js](https://wusfen.github.io/console.js/dist/console.js)  
```html
<script src="https://wusfen.github.io/console.js/dist/console.js"></script>
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
<!-- ![console](https://wusfen.github.io/console.js/example/example.png)   -->
![console](https://wusfen.github.io/console.js/example/console.js.png)  


## 注意
hash路由可用以下代替
```javascript
url#/route#f12    url?f12    url?k=v&f12
 ```
