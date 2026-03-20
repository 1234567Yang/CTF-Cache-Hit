import puppeteer from 'puppeteer';
export async function screenshot(url: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--single-process',
            '--no-zygote',
            '--disable-extensions',
            '--disable-background-networking',
            '--disable-software-rasterizer'
        ]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const image = Buffer.from(await page.screenshot());


    await browser.close(); return image;
}