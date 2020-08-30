import HeadlessHorseman from './headless-horseman'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import HeadlessRouter from './routers/headless-router';
import PuppeteerParser from './parsers/puppeteer-parser';

function init(preconfiguredInstance?: HeadlessHorseman | null): HeadlessHorseman {
    let headlessInstance: HeadlessHorseman | null

    if (preconfiguredInstance) {
        headlessInstance = preconfiguredInstance;
    } else {
        let koa = new Koa, router = new HeadlessRouter(new KoaRouter), parser = new PuppeteerParser

        headlessInstance = new HeadlessHorseman(koa, router, parser)
    }

    headlessInstance.initApp()

    return headlessInstance
}

const hh = init()
const app = hh.app
const server = hh.server

export {
    server,
    app
} 