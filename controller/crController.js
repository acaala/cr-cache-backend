const cheerio = require('cheerio');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Redis = require('redis');
const client = Redis.createClient({
    url: process.env.REDIS_URL
})
client.connect(); 
client.on('error', (err) => console.log('Redis Client Error', err));

let baseURL = 'https://development.coinrivet.com';
const fetchPage = async (req, res) => {
    let label
    if(req.url == '/cr-home') {
        url = baseURL
        label  = 'cr-home'
    } else if (req.url == '/cr-prices') {
        url = `${baseURL}/prices`
        label = 'cr-prices'
    }
    try {
        let start = Date.now();
        const response = await client.get(label);
        if(response != null) {
            const uncachedTime = await client.get(`${label}UncachedTime`)
            res.json({response: JSON.parse(response), time: Date.now() - start, uncachedTime})
        } else {
            const page = await fetch(url);
            const body = await page.text();
            const $ = cheerio.load(body);
            client.set(label, JSON.stringify($.html()));
            let uncachedTime = Date.now() - start;

            client.set(`${label}UncachedTime`, JSON.stringify(uncachedTime))
            res.json({response: body, time: uncachedTime, uncachedTime});
        }

    } catch (err) {
        console.log(err);
    }
}

const clearPage = async (req, res) => {
    let label
    if(req.url == '/cr-home-clear') {
        label  = 'cr-home'
    } else if (req.url == '/cr-prices-clear') {
        label = 'cr-prices'
    }
    try {
        await client.del(label);
        await client.del(`${label}UncachedTime`)
        res.json({time: '-', uncachedTime: '-'});
    } catch (err) {
        console.log(err);
    }
}

const flushAll = async (req, res) => {
    try {
        await client.flushAll();
        res.json('flushed');
    } catch (err) {
        console.log(err);
    }
}

module.exports = {fetchPage, clearPage, flushAll}