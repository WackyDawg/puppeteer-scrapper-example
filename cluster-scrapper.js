import { Cluster } from 'puppeteer-cluster';

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 5,
    });

    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        const title = await page.title();
        console.log(`Title of ${url}: ${title}`);
    });

    cluster.queue('https://example.com');
    cluster.queue('https://example.org');
    cluster.queue('https://example.net');

    await cluster.idle();
    await cluster.close();
})();