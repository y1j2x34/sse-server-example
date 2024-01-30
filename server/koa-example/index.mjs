import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa-cors';
import { PassThrough } from 'stream';

const koa = new Koa()

const router = new Router();

router.all('/sse', (ctx) => {
    
    ctx.request.socket.setTimeout(0);
    ctx.request.socket.setNoDelay(true);
    ctx.request.socket.setKeepAlive(true);
    
    ctx.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    const stream = new PassThrough();
    ctx.status = 200;
    ctx.body = stream;

    (async () => {
        for(let i = 0; i < 10; i++) {
            await sleep(1000);
            const data = JSON.stringify({
                seq: i,
                time: new Date()
            });
            console.log('write data', data);
            stream.write(`data: ${data}\n\n`)
        }
    })()
    
    stream.on('close', () => {
        console.log('stream closed!');
    })
})

koa.use(cors());
koa.use(router.routes());
koa.use(router.allowedMethods());


koa.listen(10086, function(){
    console.log('Serving!')
    console.log('- Local: http://localhost:10086')
})

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}