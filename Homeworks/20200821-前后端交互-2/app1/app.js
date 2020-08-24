const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const KoaRouter = require('koa-router');
const upload = require('./middlewares/upload');
const mysql = require('mysql2/promise');
const KoaBody = require('koa-body');
// const jwt = require('jsonwebtoken');
const jwt = require('jwt-simple');
const koaJwt = require('koa-jwt');

const dbConfig = require('./database.json');
const serverPort = 8080;

const jwtSecret = 'jwtSecret';
const tokenExpiresTime = 1000 * 60 * 60 * 24 * 7;

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

app.use(function (ctx, next) {
    return next().catch((err) => {
        if (401 == err.status) {
            ctx.status = 401;
            ctx.body = { code: 1, message: '你还没有登录' };
        } else {
            throw err;
        }
    });
});

app.use(koaJwt({ secret: jwtSecret }).unless({
    path: [/^\/login/]
}))

const router = new KoaRouter();

router.get('/', async ctx => {
    ctx.body = '开课吧';
})

router.post('/login', KoaBody({ multipart: true }), async ctx => {
    let { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.status = 400;
        return ctx.body = {
            code: 1,
            message: '参数错误'
        };
    }

    let [[rs]] = await db.query("select * from `users` where `username`=?", [username]);

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

    // ctx.set('Authorization', jwt.sign({
    //     id: rs.id,
    //     username: rs.username
    // }, 'kaikeba'));

    let payload = {
        exp: Date.now() + tokenExpiresTime,
        username : rs.username,
        user_id : rs.id
    }
    let token = jwt.encode(payload, jwtSecret)
    ctx.set('authorization', token);

    ctx.body = {
        id: rs.id,
        username: rs.username
    }

});

router.get('/getPhotos', getPayload, async ctx => {
    let [rs] = await db.query("select * from `photos` where `user_id`=?", [
        ctx.user_id
    ]);
    rs = rs.map(r => ({
        ...r,
        url: `http://localhost:${serverPort}` + '/public/upload/' + r.fileName
    }));
    ctx.body = rs;
});

router.post('/upload', upload(), getPayload, async ctx => {
    let files = ctx.request.files;
    current = files.file;
    let lastPos = current.path.lastIndexOf("/");
    if (lastPos == -1) {
        lastPos = current.path.lastIndexOf("\\");
    }
    let filename = current.path.substring(lastPos + 1);
    let rs = await db.query("insert into `photos` (`fileName`, `user_id`) values (?, ?)", [
        filename,
        ctx.user_id
    ]);
    ctx.body = {
        url: '/static/upload/' + filename
    };
});

app.use(router.routes());

app.listen(serverPort);

async function getPayload(ctx, next) {
    let token = ctx.header.authorization
    let payload = jwt.decode(token.split(' ')[1], jwtSecret);
    ctx.user_id = payload.user_id;
    // console.log(ctx);
    await next();
}

// function verify() {
//     return async (ctx, next) => {
//         let authorization = ctx.request.header.authorization;
//         if (authorization == 'null') {
//             ctx.status = 401;
//             return ctx.body = {
//                 code: 1,
//                 message: '你还没有登录'
//             }
//         } else {
//             let user = jwt.verify(authorization, 'kaikeba');
//             if (!user) {
//                 ctx.status = 401;
//                 return ctx.body = {
//                     code: 1,
//                     message: '你还没有登录'
//                 }
//             }
//             ctx._user = user;
//         }
//         await next();
//     }
// }