const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const promiseArray = new Set(); //Подписчики

router.get('/subscribe', async (ctx, next) => {
    ctx.status = 200;
    ctx.body = await new Promise((resolve, reject) => {       
        promiseArray.add(resolve); // накидываем в массив
    });
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message;
    if (!message) {
        ctx.throw(400, 'Message is empty');
    }

    promiseArray.forEach(element => element(message)); //спамим
    promiseArray.clear();

    ctx.status = 200;    
});

app.use(router.routes());

module.exports = app;
