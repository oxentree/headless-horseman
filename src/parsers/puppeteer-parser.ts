import {
    HeadlessParser,
    HeadlessOutput,
    HeadlessInput,
    HeadlessInputItemTarget,
    HeadlessOutputItem,
    HeadlessOutputItemTarget
} from "../types/headless-types";
import {
    Browser,
    launch,
    Page
} from 'puppeteer'

export default class PuppeteerParser implements HeadlessParser {
    // @ts-ignore
    private _browser: Browser

    set browser(browser: Browser) {
        this._browser = browser
    }

    get browser(): Browser {
        return this._browser
    }

    async parse(data: HeadlessInput): Promise<HeadlessOutput> {
        this.browser = await this._launch()

        return await this._gatherResults(data)
    }

    private async _launch() {
        return await launch({
            headless: true
        });
    }

    private _close() {
        return this.browser.close();
    }

    private _openPage() {
        return this.browser.newPage();
    }

    private async _gatherResults(data: HeadlessInput): Promise<HeadlessOutput> {
        let batchData: HeadlessOutputItem[] = [];

        for await (let item of data.items) {
            let page = await this._openPage();

            let id = item.id,
                url = item.url,
                timeout = item.timeout || 3000,
                targets = item.targets || [],
                pageData: HeadlessOutputItem

            try {
                await page.goto(url, {
                    timeout: timeout
                    // referer: 'https://www.google.com/'
                });
            } catch (e) {
                console.log(e.message)
                // skipping URLs that don't actually exist
                pageData = {
                    id: id,
                    success: false,
                    result: e.message,
                    targets: [] // targets won't be processed
                }

                batchData.push(pageData)

                await page.close();
                continue;
            }

            pageData = {
                id: id,
                success: true,
                result: "Page processed successfully",
                targets: await this._parsePage(targets, page)
            }

            batchData.push(pageData)

            await page.close();
            continue;
        }

        await this._close()

        return {
            data: {},
            items: batchData
        }
    }

    private async _parsePage(targets: HeadlessInputItemTarget[], page: Page): Promise<HeadlessOutputItemTarget[]> {
        let results: HeadlessOutputItemTarget[] = []

        for (let target of targets) {
            let selector = target.selector,
                scope = target.scope,
                timeout = target.timeout || 3000

            try {
                await page.waitForSelector(selector, {
                    timeout: timeout
                });

                let result = await page.evaluate(selector => {
                    let el = document.querySelector(selector);

                    return el.innerHTML;
                }, selector);

                results.push({
                    result: result,
                    scope: scope,
                    success: true
                })
            } catch (e) {
                results.push({
                    result: e.message,
                    scope: scope,
                    success: false
                })
            }
        }

        return results
    }
}