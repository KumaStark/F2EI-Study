const Koa = require('koa');
const proxy = require('koa-server-http-proxy');
const KoaStaticCache = require('koa-static-cache');


const app = new Koa();

// webpack -> vue -> react
app.use( proxy('/api', {
    // http://localhost:9999/api/getPhotos
    
    target: 'http://localhost:8081',
    // http://localhost:8081/api/getPhotos
    pathRewrite: { 
        // http://localhost:8081/getPhotos
        '^/api': ''
    }
}) );


// 提供静态资源服务 
app.use(KoaStaticCache('./public', {
    prefix: '/public',
    gzip: true,
    dynamic: true
}));



app.listen(8888);