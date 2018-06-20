## js异步编程

以请求一个豆瓣的api为例子。

请求豆瓣api的函数：
```js
function fetchUser() { 
    return new Promise((resolve, reject) => {
        fetch('https://api.douban.com/v2/book/1220562')
        .then((data) => {
            resolve(data.json());
        }, (error) => {
            reject(error);
        })
    });
}
```

### Promise方式
```js
function getUserByPromise(){
    fetchUser()
    .then(data=>console.log(data),
    error=>console.log(error))
}
```

### Generator方式

```js
function* fetchUserByGenerator (){
    const user = yield fetchUser();
    return user
}

const g= fetchUserByGenerator();
const result = g.next().value;

result.then(res=>{
    console.log(res)
},error=>{
    console.log(error)
})
```

### async方法
```js
async function getUserByAsycn(){
    return await fetchUser();
}

getUserByAsycn()
.then(res=>{
 console.log(res)
},err=>{
 console.log(err)
})
```