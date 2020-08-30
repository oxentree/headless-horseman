import request from 'supertest'
import { server } from '../index'

const req = request(server)
describe('Parsing route', () => {
    it('shouldnt work with GET', done => {
        req
            .get('/parse')
            .send()
            .expect(405, done)
    })

    it('works with multiple targets', done => {
        req
            .post('/parse')
            .send({
                "data": {},
                "items": [
                    {
                        "url": "http://example.com",
                        "id": "example.com",
                        "targets": [
                            {
                                "scope": "title",
                                "selector": "h1"
                            },
                            {
                                "scope": "link",
                                "selector": "p > a"
                            }
                        ]
                    }
                ]
            })
            .expect(200, {
                "data": {},
                "items": [
                    {
                        "id": "example.com",
                        "success": true,
                        "result": "Page processed successfully",
                        "targets": [
                            {
                                "result": "Example Domain",
                                "scope": "title",
                                "success": true
                            },
                            {
                                "result": "More information...",
                                "scope": "link",
                                "success": true
                            }
                        ]
                    }
                ]
            }, done)
    });


    it('works with empty targets', done => {
        req
            .post('/parse')
            .send({
                "data": {},
                "items": [
                    {
                        "url": "http://example.com",
                        "id": "example.com",
                        "targets": []
                    }
                ]
            })
            .expect(200, {
                "data": {},
                "items": [
                    {
                        "id": "example.com",
                        "success": true,
                        "result": "Page processed successfully",
                        "targets": []
                    }
                ]
            }, done)
    })

    it('it doesnt stop for non-existing URLs', done => {
        req
            .post('/parse')
            .send({
                "data": {},
                "items": [
                    {
                        "url": "http://example.com",
                        "id": "example.com",
                        "targets": []
                    },
                    {
                        "url": "http://test-doesnt-exist.abc",
                        "id": "test-doesnt-exist.abc",
                        "targets": []
                    }
                ]
            })
            .expect(200, {
                "data": {},
                "items": [
                    {
                        "id": "example.com",
                        "success": true,
                        "result": "Page processed successfully",
                        "targets": []
                    },
                    {
                        "id": "test-doesnt-exist.abc",
                        "success": false,
                        "result": "net::ERR_NAME_NOT_RESOLVED at http://test-doesnt-exist.abc",
                        "targets": []
                    }
                ]
            }, done)
    })
})
