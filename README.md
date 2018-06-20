# console.js

#### usage.html ####
```html
<script src="path/to/console.js"></script>
```

#### #f12 开启 ####
```css
http://domain.com/usage.html#f12
```

#### 注意 ####
hash路由可用以下代替
```javascript
url#/page#f12    url##f12    url#/#f12    url?f12    url?k=v&f12
 ```

#### 加载器 ####
```console.loader.js``` 是个积体很小的文件 ，```#f12``` 时才会自动去加载 ```console.js```  

```html
<!-- 把两个文件放在同一目录 -->
<script src="path/to/console.loader.js"></script>

<!-- 或者 console属性 指定 console.js 的路径 -->
<script src="path/to/console.loader.js" console="path/to/console.js"></script>
```

#### 演示 ####
https://wusfen.github.io/console.js/example/example.html  
![console](example/example.png)  
