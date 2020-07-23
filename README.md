#### 支持 ts
```
yarn add -D @types/express
```

#### express-generator
express 脚手架

#### express --view=ejs .
> 创建公共文件。ejs 是一个后端模板引擎。

---
#### [Application-level middleware](https://www.expressjs.com.cn/guide/using-middleware.html#middleware.application)
* sub-stack
一个 route 的接受多个函数，它们构成了这个 route 的 sub-stack。当 path 满足 /user/:id 时，所有函数将依次被触发。
```
app.use('/user/:id', function (req, res, next) {
    console.log('Request URL:', req.originalUrl)
    next()
}, function (req, res, next) {
    console.log('Request Type:', req.method)
    next()
})
```
* next('route')
To skip the rest of the middleware functions from a router middleware stack, call next('route') to pass control to the next route.
```
app.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // path 为 user/0 时，不执行本函数
  res.send('regular')
})

app.get('/user/:id', function (req, res, next) {
  res.send('special')
})
```

#### [Router-level middleware](https://www.expressjs.com.cn/guide/using-middleware.html#middleware.router)
Router-level middleware works in the same way as application-level middleware, except it is bound to an instance of express.Router().

#### [Error-handling middleware](https://www.expressjs.com.cn/guide/using-middleware.html#middleware.error-handling)
Error-handling middleware always takes four arguments. You must provide four arguments to identify it as an error-handling middleware function. 

#### [Error-handling](https://www.expressjs.com.cn/en/guide/error-handling.html)
> 研究的是 Express 怎么捕获 err 的问题
* 同步：只要 throw,Express 就能捕获
> If synchronous code throws an error, then Express will catch and process it
```
app.get('/', function (req, res) {
  throw new Error('BROKEN') // Express will catch this on its own.
})
```
* 异步-失败回调：将 err 传入 next
> you must pass them to the next() function, where Express will catch and process them.
```
app.get('/', function (req, res, next) {
  fs.readFile('/file-does-not-exist', function (err, data) {
    if (err) {
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
})
```
* 异步-setTimeout 内部:必须使用 try-catch
> If the try...catch block were omitted, Express would not catch the error since it is not part of the synchronous handler code.
```
app.get('/', function (req, res, next) {
  setTimeout(function () {
    try {
      throw new Error('BROKEN')
    } catch (err) {
      next(err)
    }
  }, 100)
})
```
* 异步-Promise
> Since promises automatically catch both synchronous errors and rejected promises, you can simply provide next as the final catch handler and Express will catch errors, because the catch handler is given the error as the first argument.
```
app.get('/', function (req, res, next) {
  Promise.resolve().then(function () {
    throw new Error('BROKEN')
  }).catch(next) // Errors will be passed to Express.
})
```
* next('xxx'):跳过所有 non-error handling routing and middleware functions.
> If you pass anything to the next() function (except the string 'route'), Express regards the current request as being an error and will skip any remaining non-error handling routing and middleware functions.


