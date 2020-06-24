import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = 9999;
const IMAGE_TYPE = 'png';

const getTemplatePreviewUrl = (siteId: number) => `https://www.houzz.com/website-services/sites/${siteId}/view/`;

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
            width: 1440,
            height: 960,
            isLandscape: true,
        },
    });
    async function takeScreenShot(siteId: number) {
        const page = await browser.newPage();
        try {
            const url = getTemplatePreviewUrl(siteId);
            console.log(`take screenshot for ${url}`);
            await page.goto(url);
            return await page.screenshot({
                type: IMAGE_TYPE,
                encoding: 'binary',
            });
        } finally {
            await page.close();
        }
    }
    app.get('/screenshot', async (req, res) => {
        const siteId = Number(req.query.siteId);
        if (Number.isNaN(siteId)) {
            return res.send('siteId is invalid');
        }
        return res.type(IMAGE_TYPE).send(await takeScreenShot(siteId));
    });
    app.listen(PORT, () => console.log(`started server listening on ${PORT}`));
})();
