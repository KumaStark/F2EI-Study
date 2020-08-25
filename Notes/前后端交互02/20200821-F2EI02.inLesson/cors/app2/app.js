const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const KoaRouter = require('koa-router');
const upload = require('./middlewares/upload');
const mysql = require('mysql2/promise');

let db;

~async function() {
    db = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '12345678',
        database: 'kkb_photos'
    })
}()


const app = new Koa();

app.use(KoaStaticCache('./public', {
    prefix: '/public',
    gzip: true,
    dynamic: true
}));

let whiteList = [
    'http://localhost:8888',
    'http://localhost:9999'
]

app.use( async (ctx, next) => {

    // console.log('ctx', ctx.method);
    let requestOrigin = ctx.header.origin;

    if (
        whiteList.includes(requestOrigin)
    ) {
        ctx.set('Access-Control-Allow-Origin', requestOrigin);
    }

    if (ctx.method.toLowerCase() == 'options') {
        ctx.set('Access-Control-Request-Method', 'GET,OPTIONS,POST');

        ctx.body = '';
        return;
    }

    await next();
} )

const router = new KoaRouter();




router.get('/', async ctx => {
    ctx.body = '开课吧';
})

router.get('/getPhotos', async ctx => {

    let [rs] = await db.query("select * from `photos`");

    rs = rs.map( r => ({
        ...r,
        url: '/public/upload/' + r.name
    }) );

    ctx.body = rs;
});

router.post('/upload', upload(), async ctx => {

    let dot = ctx.request.files.file.path.lastIndexOf('/');
    let filename = ctx.request.files.file.path.substring(dot + 1);

    let rs = await db.query("insert into `photos` (`name`) values (?)", [
        filename
    ]);
    // console.log(rs);

    ctx.body = {
        url: '/public/upload/' + filename
    };
});

app.use( router.routes() );

app.listen(8081);