import puppeteer from 'puppeteer';
import fs from 'fs';


(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://quotes.toscrape.com/');

    const allQuotes = [];

    let hasNext = true;
    while (hasNext) {
        const quotes = await page.evaluate(() => {
            const quoteElements = document.querySelectorAll('.quote');
            const quotesArray = [];
            
            quoteElements.forEach(quote => {
                const text = quote.querySelector('.text').innerText;
                const author = quote.querySelector('.author').innerText;
                quotesArray.push({ text, author });
            });

            return quotesArray;
        });

        allQuotes.push(...quotes);

        const nextButton = await page.$('.next > a');
        if (nextButton) {
            await Promise.all([
                page.click('.next > a'),
                page.waitForNavigation({ waitUntil: 'networkidle0' })
            ]);
        } else {
            hasNext = false;
        }
    }

    fs.writeFileSync('all_quotes.json', JSON.stringify(allQuotes, null, 2));
    console.log('Scraping complete! Quotes saved to all_quotes.json');

    await browser.close();
})();