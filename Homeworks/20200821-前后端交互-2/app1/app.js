const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const KoaRouter = require('koa-router');
const upload = require('./middlewares/upload');
const mysql = require('mysql2/promise');
const KoaBody = require('koa-body');
const jwt = require('jsonwebtoken');
const koaJWT = require('koa-jwt');
const dbConfig = require('./database.json');

let db;
~async function () {
    db = await mysql.createConnection(dbConfig);
}()

const app = new Koa();

app.use(KoaStaticCache('./public', {
    prefix: '/public',
    gzip: true,
    dynamic: true
}));


const router = new KoaRouter();


router.get('/', async ctx => {
    ctx.body = '开课吧';
})

router.post('/login', KoaBody({multipart: true}), async ctx => {
    let { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.status = 400;
        return ctx.body = {
            code: 1,
            message: '参数错误'
        };
    }

    let [[rs]] = await db.query("select * from `users` where `username`=?", [
        username
    ]);

    if (!rs) {
        ctx.status = 404;
        return ctx.body = {
            code: 2,
            message: '用户不存在'
        };
    }

    // console.log('rs', rs.password != password);
    if (rs.password != password) {
        ctx.status = 404;
        return ctx.body = {
            code: 3,
            message: '密码错误'
        };
    }

    ctx.set('Authorization', jwt.sign({
        id: rs.id,
        username: rs.username
    }, 'kaikeba'));

    ctx.body = {
        id: rs.id,
        username: rs.username
    }

});

router.get('/getPhotos', verify(), async ctx => {


    let [rs] = await db.query("select * from `photos` where `user_id`=?", [
        ctx._user.id
    ]);

    rs = rs.map(r => ({
        ...r,
        url: '/public/upload/' + r.name
    }));

    ctx.body = rs;
});

router.post('/upload', verify(), upload(), async ctx => {

    console.log(ctx._user);

    let dot = ctx.request.files.file.path.lastIndexOf('/');
    let filename = ctx.request.files.file.path.substring(dot + 1);

    let rs = await db.query("insert into `photos` (`name`, `user_id`) values (?, ?)", [
        filename,
        ctx._user.id
    ]);
    // console.log(rs);

    ctx.body = {
        url: '/public/upload/' + filename
    };
});

app.use(router.routes());

app.listen(8080);

function verify() {
    return async (ctx, next) => {
        let authorization = ctx.request.header.authorization;
        if (authorization == 'null') {
            ctx.status = 401;
            return ctx.body = {
                code: 1,
                message: '你还没有登录'
            }
        } else {
            let user = jwt.verify(authorization, 'kaikeba');
            if (!user) {
                ctx.status = 401;
                return ctx.body = {
                    code: 1,
                    message: '你还没有登录'
                }
            }

            ctx._user = user;
        }

        await next();
    }
}