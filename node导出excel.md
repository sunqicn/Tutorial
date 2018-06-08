## 后端使用的是node express， 需要导出excel并使得前端可以下载。

## 有两种办法可以实现：
    - 在node端直接导出excel，发送这个excel的地址给前端。
    - 生成excel文件流的形式发送给前端，前端自行下载保存。

## 第一种办法，直接生成excel文件，并发送给前端这个文件的地址。

    -node端
 ```js
    var express = require('express');
    var router = express.Router();
    var path = require('path');
    var fs = require('fs');
    var xlsx = require('node-xlsx');
    var mainWarning = require('./../models/mainWarning.js');
    router.post('/dltd', function(req, res, next) {
        const data = [[1,2,3],[4,5,6]]
        // 合并单元格
        // const range = {s: {c: 0, r:0 }, e: {c:0, r:3}}; // A1:A4
        // const option1 = {'!merges': [ range ]};
        //生成xlsx文件
        const buffer = xlsx.build([{
          name: "coverSheet",
          data: data
        }]);
        const fileName = new Date().getTime() + '.xlsx'
        const filtPath = path.resolve(__dirname, '../download_file', 'warning.xlsx')
        fs.writeFileSync(filtPath, buffer, 'binary');
        // res.sendFile(filtPath)
        var options = {
          root: "download_file",
          dotfiles: 'deny',
          headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
          }
        };
        res.sendFile('warning.xlsx', options, function(err) {
          if (err) {
            console.log(err);
            res.status(err.status).end();
          } else {
            console.log('Sent:', fileName);
          }
        });
    });
```

    -前端，模拟表单提交，发送post请求。

```js
        let tempForm = document.createElement('form')
        tempForm.action = config.api+'/dlfs/dltd';
        tempForm.method = 'post'
        tempForm.style.display = 'none'
        let params = {"name":"hahahha"};
        for (var x in params) {
            let opt = document.createElement('textarea')
            opt.name = x
            opt.value = params[x]
            tempForm.appendChild(opt)
        }
        document.body.appendChild(tempForm)
        tempForm.submit()
        return tempForm
```


## 第二种办法，代码没写完。。。
