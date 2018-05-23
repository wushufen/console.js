# console.js

#### usage.html ####
```html
<script src="path/to/console.js"></script>
```

#### #f12 开启 ####
```
http://domain.com/usage.html#f12
```

#### 注意 ####
hash路由可用以下代替
```
url#/page#f12    url##f12    url#/#f12    url?f12    url?k=v&f12
 ```

#### console.loader.js ####
```console.loader.js``` 是个积体很小的文件 ，```#f12``` 时才会自动去加载 ```console.js```  

```html
<!-- 把两个文件放在同一目录 -->
<script src="path/to/console.loader.js"></script>

<!-- 或者 console属性 指定 console.js 的路径 -->
<script src="path/to/console.loader.js" console="path/to/console.js"></script>
```

#### 效果图 ####
![console](example.360.png)  
