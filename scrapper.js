import puppeteer from 'puppeteer';

async function scrapeDeals() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto('https://www.aliexpress.com/ssr/300000556/zQFHEaEPNJ?spm=a2g0o.home.tab.2.650c76dbyAQQ6K&disableNav=YES&pha_manifest=ssr&_immersiveMode=true', {
        waitUntil: 'networkidle2'
    });

    const products = await page.evaluate(() => {
        const productsElements = document.querySelectorAll('.aec-view');
        const productsArray = [];

        productsElements.forEach(product => {
            const nameElement = product.querySelector('span.AIC-ATM-multiLine > span');
            const priceElement = product.querySelector('span.aec-text.AIC-PI-price-text.AIC-PI-hitdeals.aec-text--overflow-hidden.aec-text--singleline');

            const name = nameElement ? nameElement.innerText.trim() : null;
            const price = priceElement ? priceElement.innerText.trim() : null;

            if (name) { // Only add if name exists
                productsArray.push({ name, price });
            }
        });

        return productsArray;
    });

    console.log(products);

    await browser.close();
}

scrapeDeals();
