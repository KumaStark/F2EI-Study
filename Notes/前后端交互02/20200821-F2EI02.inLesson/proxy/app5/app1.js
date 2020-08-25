const Koa = require('koa');
const http = require('http');
const KoaStaticCache = require('koa-static-cache');

// 这是一个简单的静态web服务器

// node 即能接电话（提供服务），还能打电话（就像浏览器发送请求一样）
// 我们就可以利用这个特性，去请求可能跨域的资源

const app = new Koa();

// 又提供一个代理服务，去访问其它的服务器
app.use( async (ctx, next) => {
    // 我们这里定义一下，如果不满足 /public，比如 /api，那么就走这里的逻辑
    // console.log('我走了这里', ctx.request.header);

    if (ctx.request.url == '/api') {
        // 我就去请求 http://localhost:8081/getPhotos

        // 请求代理
        // 不受同源策略限制
        let data = await proxyRequest(ctx);

        ctx.body = data;
    }

    await next();
} )

// 提供静态资源服务 
app.use(KoaStaticCache('./public', {
    prefix: '/public',
    gzip: true,
    dynamic: true
}));



app.listen(9999);



function proxyRequest(ctx) {
    return new Promise(resolve => {
        const options = {
            protocol: 'http:',
            hostname: 'localhost',
            port: 8081,
            path: '/getPhotos',
            method: 'get',
            headers: ctx.request.header
        };

        const req = http.request(options, res => {
            let data = '';
            res.on('data', (chunk) => {
                // console.log(`BODY: ${chunk}`);
                data += chunk.toString();
            });

            res.on('end', () => {
                // console.log('No more data in response.');
                // console.log('data', data);
                resolve(data);
            });

        });

        req.write('');
        req.end();
    });
}