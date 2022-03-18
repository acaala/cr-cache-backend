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
    } else if (req.url == '/cr-news') {
        url = `${baseURL}/news`
        label = 'cr-news'
    }  else if (req.url == '/cr-nft') {
        url = `${baseURL}/nft-calendar`
        label = 'cr-nft'
    } else if (req.url == '/cr-support') {
        url = `${baseURL}/support`
        label = 'cr-support'
    }
    try {
        let start = Date.now();
        const response = await client.get(label);
        if(response != null) {
            const uncachedTime = await client.get(`${label}UncachedTime`)
            const size = await client.MEMORY_USAGE(label);
            res.json({response: JSON.parse(response), time: Date.now() - start, uncachedTime, size})
        } else {
            const page = await fetch(url);
            const body = await page.text();
            const $ = cheerio.load(body);

            client.set(label, JSON.stringify($.html()));
            let uncachedTime = Date.now() - start;
            const size = await client.MEMORY_USAGE(label);

            client.set(`${label}UncachedTime`, JSON.stringify(uncachedTime))
            res.json({response: $.html() , time: uncachedTime, uncachedTime, size});
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
    } else if (req.url == '/cr-news-clear') {
        url = `${baseURL}/news`
        label = 'cr-news'
    }  else if (req.url == '/cr-nft-clear') {
        url = `${baseURL}/nft-calendar`
        label = 'cr-nft'
    } else if (req.url == '/cr-support-clear') {
        url = `${baseURL}/support`
        label = 'cr-support'
    }
    try {
        await client.del(label);
        await client.del(`${label}UncachedTime`)
        res.json({time: '-', uncachedTime: '-'});
    } catch (err) {
        console.log(err);
    }
}

const fetchJS = async (req, res) => {
    let label
    if(req.url == '/js-main') {
        label = 'js-main'
        url = 'https://development.coinrivet.com/wp-content/themes/coinrivet/assets/scripts/main.js?v=1.0.79'
    } else if (req.url == '/js-landing') {
        label = 'js-landing'
        url = 'https://development.coinrivet.com/wp-content/themes/coinrivet/assets/scripts/landing.js?v=1.0.79'
    }
    try {
        const script = await client.get('js-main');
        if(script != null) {
            res.type('.js')
            res.send(script)
        } else {
            const response = await fetch(url);
            let script = await response.text();
            client.set(label, script);
            res.type('.js')
            res.send(script)
        }
    } catch (err) {
        console.log(err)
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

module.exports = {fetchPage, clearPage, flushAll, fetchJS}