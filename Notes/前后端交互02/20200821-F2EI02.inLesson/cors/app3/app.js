const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');

// 这是一个简单的静态web服务器

const app = new Koa();

app.use(KoaStaticCache('./public', {
    prefix: '/public',
    gzip: true,
    dynamic: true
}));

app.listen(9999);