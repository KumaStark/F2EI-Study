##前后端交互02  — jsonp



## 课堂目标

- 掌握jsonp的原理
- 会搭建node服务器创建jsonp接口
- 学会封装jsonp
- 学会jsonp的实际运用

## 知识要点

- 跨域解决
- jsonp原理及封装
- jsonp服务器搭建
- jsonp实际运用

##ajax问题

- 浏览器同源策略

  - 同源策略是浏览器的一个安全功能，不同源的客户端脚本在没有明确授权的情况下，不能读写对方资源
  - 源  ：协议、域名和端口号

- 跨域

- 不受同源策略影响的资源的引入

  - <script src="..."></script>，<img>，<link>，<iframe>

## jsonp

JSONP*(JSON with Padding)解决跨域问题；可以让网页从别的域名（网站）那获取资料，即跨域读取数据。

- jsonp原理



- 通过script来实现跨域；



- 服务端实现

  

- 请求百度接口

  ```js
  https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=hello&cb=succFn
  ```


​	

##jsonp封装





## 蘑菇街案例实现

- 实现动态数据的获取及渲染

  ```js
  https://list.mogu.com/search?callback=jQuery2110599693622515429_1558943916971&_version=8193&ratio=3%3A4&cKey=15&page=1&sort=pop&ad=0&fcid=52014&action=food
  ```

  

- 实现滚动底部数据的重新获取及更新



-  jsonp问题

  ​	1.只能是get请求

  ​	2.安全性问题

## 总结

- jsonp原理
- jsonp封装
- 会搭建node服务器创建jsonp接口
- jsonp实际运用