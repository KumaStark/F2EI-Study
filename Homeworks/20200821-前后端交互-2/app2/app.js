const Koa = require('koa');
const proxy = require('koa-server-http-proxy');
const KoaStaticCache = require('koa-static-cache');

const app = new Koa();

app.use( proxy('/api', {
    target: 'http://localhost:8080',
    pathRewrite: { 
        '^/api': ''
    }
}) );

app.use(KoaStaticCache('./static', {
    prefix: '/static',
    gzip: true,
    dynamic: true
}));

app.listen(9999);