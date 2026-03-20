import puppeteer from 'puppeteer';
export async function screenshot(url: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const image = Buffer.from(await page.screenshot());


    await browser.close(); return image;
}