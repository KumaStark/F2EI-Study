const fs = require("fs");
module.exports = {
    getfavicon: ctx => {
        ctx.body = fs.readFileSync("./favicon.ico");
    },
    middleWare: {
        showUrlRequest: async (ctx, next) => {
            console.log('Requested Url:', ctx.url);
            await next();
        },
    }
}