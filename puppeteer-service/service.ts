import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = 8080;
const IMAGE_TYPE = 'png';

const getTemplatePreviewUrl = (siteId: number) => `https://www.houzz.com/website-services/sites/${siteId}/view/`;

(async () => {
    const browser = await puppeteer.launch({
        args: [
            // https://developers.google.com/web/tools/puppeteer/troubleshooting#running_puppeteer_in_docker
            // Required for Docker version of Puppeteer
            '--no-sandbox',
            '--disable-setuid-sandbox',
            // This will write shared memory files into /tmp instead of /dev/shm,
            // because Docker’s default for /dev/shm is 64MB
            '--disable-dev-shm-usage',
        ],
        headless: true,
        defaultViewport: {
            width: 2440,
            height: 1024,
            isLandscape: true,
        },
    });
    process.on('exit', () => browser.close());
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
    app.listen(PORT, () => console.log(`started puppeteer service`));
})();
