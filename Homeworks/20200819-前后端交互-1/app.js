const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaStaticCache = require("koa-static-cache");
const mainCtl = require("./controllers/main");
const PhotosCtl = require("./controllers/PhotosController");

const serverPort = 8080;
const app = new Koa();
const router = new KoaRouter();

app.use(
  KoaStaticCache("./static", {
    prefix: "/static",
    gzip: true,
    dynamic: true,
  })
);

router.get("/", async (ctx) => {
  ctx.response.redirect('/static/index.html');
});
router.get("/getPhotos", PhotosCtl.getPhotos);
router.post("/upload", PhotosCtl.saveToFileSystem(), PhotosCtl.proceedFiles);
router.get("/favicon.ico", mainCtl.getfavicon);

app.use(router.routes());

app.listen(serverPort);