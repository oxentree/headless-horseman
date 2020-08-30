import Koa from 'koa'
import HeadlessRouter from './routers/headless-router'
import {
  HeadlessParser
} from './types/headless-types'
import bodyParser from 'koa-bodyparser'
import { Server } from 'http'
import { AddressInfo } from 'net'
import { Http2Server } from 'http2'

export default class HeadlessHorseman {
  private _app: Koa
  private _router: HeadlessRouter
  private _parser: HeadlessParser
  // @ts-ignore
  private _server: Http2Server

  constructor(koa: Koa, router: HeadlessRouter, parser: HeadlessParser) {
    this._app = koa
    this._router = router
    this._parser = parser
  }

  get app(): Koa {
    return this._app
  }

  get server(): Http2Server {
    return this._server
  }

  initApp() {
    this.settleExtensions()
    this.settleRouter()

    this.launch()
  }

  settleRouter() {
    this.app.use(this._router.fetchRoutes(this._parser))
    this.app.use(this._router.fetchAllowedMethods())
  }

  settleExtensions() {
    this.app.use(bodyParser())
  }

  launch() {
    let port = process.env.PORT || 8080

    this._server = this.app.listen(port as number, function (this: Server) {
      let { address, port } = this.address() as AddressInfo
      console.log('Listening on %s', `${address}:${port}`)
    })

    this.app.on('error', e => {
      console.log(e.code)

      throw e
    })
  }
}