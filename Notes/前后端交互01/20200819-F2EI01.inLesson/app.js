const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const KoaRouter = require('koa-router');
const upload = require('./middlewares/upload');

const app = new Koa();

app.use(KoaStaticCache('./public', {
    prefix: '/public',
    gzip: true,
    dynamic: true
}));

const router = new KoaRouter();

router.get('/getAll', async ctx => {
    // 读数据库
    let rs = [
        {id:1, name: 'upload_7fc3c565da05ae9e43b5d9a991fbbe2c.png'},
        {id:2, name: 'upload_7fc3c565da05ae9e43b5d9a991fbbe2c.png'}
    ];

    rs = rs.map( r => ({
        ...rs,
        url: '/public/upload/' + r.name
    }) );


})


router.get('/', async ctx => {
    ctx.body = '开课吧';
})

router.post('/upload', upload(), async ctx => {
    // console.log('file', ctx.request.files);

    // 根据 ctx.request.files 把数据记录到数据库中

    console.log(ctx.request.files);

    let dot = ctx.request.files.file.path.lastIndexOf('/');
    let filename = ctx.request.files.file.path.substring(dot + 1);
    ctx.body = {
        url: '/public/upload/' + filename
    };
});

app.use( router.routes() );

app.listen(8081);