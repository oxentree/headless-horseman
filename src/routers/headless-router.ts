import KoaRouter from 'koa-router'
import {
    HeadlessParser
} from '../types/headless-types';
import Router from 'koa-router';

export default class HeadlessRouter {
    private _router: KoaRouter
    // @ts-ignore
    private _parser: HeadlessParser

    constructor(router: KoaRouter) {
        this._router = router;
    }

    private _initRoutes() {
        this._initParsingRoutes()
    }

    private _initParsingRoutes() {
        this._router.get('/', ctx => {
            ctx.body = "Nope"
        })

        this._router.post('/parse', async (context, next) => {
            let request = context.request

            context.body = await this._parser.parse(request.body)

            await next()
        })
    }

    fetchRoutes(parser: HeadlessParser): Router.IMiddleware {
        this._parser = parser

        this._initRoutes()

        return this._router.routes()
    }

    fetchAllowedMethods(): Router.IMiddleware {
        return this._router.allowedMethods()
    }
}