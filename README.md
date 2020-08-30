# Headless Horseman
Uses puppeteer and the latest Chrome stable build to reliably parse JavaScript-heavy web pages.

It simply queries an item (page, with a unique id) for a number of targets, each of the targets should have a scope and a selector.

It does not challenge parsed results against regular expressions or stuff like that, that task should be performed by the consumer of the results.

# Request payload 
`item.id` can be any string, but it needs to be available for when you process the results

`target.scope` should be available as an unique identifier across an item, so you can identify it within the result set, just like `item.id`

```json
{
    "data": {},
    "items": [
        {
            "url": "http://example.com",
            "id": "example.com",
            "targets": [
                {
                    "scope": "title",
                    "selector": "h1"
                }
            ]
        }
    ]
}
```

# Response payload
```json
{
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
                }
            ]
        }
    ]
}
```

# Todo
- [ ] use a non-privileged user for Node in the Docker container
- [ ] add customization options in `headless-horseman.json`
- [ ] spawn child processes for background processing of larger batches
- [ ] add callback as an alternative to inline answer
- [ ] add a remote logging solution - winston?
- [ ] add lighter parsers for server-rendered pages
- [ ] add auth (at least basic)
- [ ] pm2 ecosystem?

# Run
Docker
```bash
docker-compose up --build
docker-compose -f docker-compose.dev.yml up --build
```

Standalone prod
```bash
npm run build
```

Standalone dev
```bash
npm run watch
```
