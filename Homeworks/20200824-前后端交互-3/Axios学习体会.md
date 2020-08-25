# axios 的使用以及源码分析学习笔记

## 1.axios的定义

- Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器中使用javascript的module设计模式引用使用，也可以在 node.js 中加载使用。

## 2.axios的特点

- 从浏览器中创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF (**C**ross-**S**ite **R**equest **F**orgery 跨站请求伪造)

## 3.axios的使用及源码分析

### (1)通过 axios 发送请求并提取反馈数据

- axios 实例化后返回的一个函数
  - 可以直接调用这个函数来创建请求
    - 使用方法：`axios(config)` 或者 `axios(url[, config])`
  - 这个函数里实现了get、post等接口
    - 包括：request、get、delete、head、options、post、put、patch
    - 使用方法（以post为例）：`axios.post(url[, data[, config]])`
  - 调用函数本身或者接口之后返回一个promise对象
    - 可以使用await来处理返回对象
    - 也可以使用then()来处理
  
  - 处理后的得到内容（响应结构）
    - 为一个对象，包含以下信息：
      - data：由服务器提供的响应内容，类似ctx.body的内容，是获取响应数据的主要来源
      - status：来自服务器响应的 HTTP 状态码
      - statusText：来自服务器响应的 HTTP 状态信息
      - headers：服务器响应的头信息
      - config：发送请求时的配置信息
      - request：根据配置信息，在浏览器生成XMLHttpRequest的实例，或在node.js中生成ClientRequest的实例，用于获取response

- axios 的各个接口实现，原理是在其prototype原型上挂载各个接口的实现函数
- `axios.request(config)` 接口的实现是其他接口实现的基础
  - config在request实现函数中通过名为mergeConfig的内部函数，与默认配置合并（根据不同的配置内容自动决定是否覆盖合并或增量合并）
  - [config可配置的内容详情](http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE)

- `axios.request` 通过内部函数getAdapter实现自动识别当前环境为浏览器或者node.js等服务端环境，随后通过将config文件传递给对应的adapter来实现请求发送
  - 通过 `typeof XMLHttpRequest !== 'undefined'` 为 `true` 来判断当前为浏览器环境，反之则为node.js等服务端环境
  - adapter获取由request传入的config对象，并返回promise对象给request
  - 最终该promise对象由调用request语句的await前缀或then解析，以此将获取到的数据提取出来

## (2) axios 的拦截器（interceptor）

- 拦截器的主要作用是在请求或响应被 `then` 或 `catch` 处理前拦截它们，然后做一些统一的配置

- 添加拦截器和删除拦截器

  - 添加请求拦截器

    ```js
    axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        return config;
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      });
    ```

  - 添加响应拦截器

    ```js
    axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        return response;
      }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
      });
    ```

  - 移除拦截器（给添加的拦截器增加一个变量名）

    ```js
  const myInterceptor = axios.interceptors.request.use(function () {/*...*/});axios.interceptors.request.eject(myInterceptor);
    ```

- 请求拦截器的实现原理：

  - 实例化axios对象时为其创建子对象interceptors，其中包含InterceptorManager类（拦截器管理器）的两个实例：request、response

  - 通过InterceptorManager类实例的use方法，添加需要在请求发送前或者响应处理前执行的函数（功能模块）

  - 在执行request发送请求时，先新建一个chain列表（作为链使用）并将最终要执行的getAdapter和一个undefined压入底部

  - 通过forEach将所有在interceptors中注册过的函数堆叠入chain列表

  - 通过下方代码，逐个调用注册的函数，最终再执行getAdapter

    ```js
    while (chain.length) {
    	promise = promise.then(chain.shift(), chain.shift());
    }
    ```
    
  
- 响应拦截器的实现原理与请求拦截器类似，只是注册的函数在接收response之后执行

axios

