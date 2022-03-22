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
    // if(req.url == '/cr-home') {
    //     url = baseURL;
    //     label  = 'cr-home';
    // } else if (req.url == '/cr-prices') {
    //     url = `${baseURL}/prices`;
    //     label = 'cr-prices';
    // } else if (req.url == '/cr-news') {
    //     url = `${baseURL}/news`;
    //     label = 'cr-news';
    // } else if (req.url == '/cr-nft') {
    //     url = `${baseURL}/nft-calendar`;
    //     label = 'cr-nft';
    // } else if (req.url == '/cr-support') {
    //     url = `${baseURL}/support`;
    //     label = 'cr-support';
    // }
    switch(req.url) {
        case '/cr-home':
            url = baseURL;
            label  = 'cr-home';
            break;
        case '/cr-prices':
            url = `${baseURL}/prices`;
            label = 'cr-prices';
            break;
        case '/cr-news':
            url = `${baseURL}/news`;
            label = 'cr-news';
            break;
        case '/cr-nft':
            url = `${baseURL}/nft-calendar`;
            label = 'cr-nft';
            break;
        case '/cr-support':
            url = `${baseURL}/support`;
            label = 'cr-support';
            break;
        case '/cr-market-data':
            url = `${baseURL}/market-data`;
            label = 'cr-market-data';
            break;
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
    switch(req.url) {
        case '/cr-home-clear':
            label  = 'cr-home';
            break;
        case '/cr-prices-clear':
            label = 'cr-prices';
            break;
        case '/cr-news-clear':
            label = 'cr-news';
            break;
        case '/cr-nft-clear':
            label = 'cr-nft';
            break;
        case '/cr-support-clear':
            label = 'cr-support';
            break;
        case '/cr-market-data-clear':
            label = 'cr-market-data';
            break;
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
    let label;
    let base = 'https://development.coinrivet.com/wp-content/themes/coinrivet/assets/scripts/';
    let v = '?v=1.0.79';
    switch(req.url) {
        case '/js-main':
            label = 'js-main';
            url = `${base}main.js${v}`;
            break;
        case '/js-landing':
            label = 'js-landing';
            url = `${base}landing.js${v}`;
            break;
        case '/js-prices':
            label = 'js-prices';
            url = `${base}prices.js${v}`;
            break;
        case '/js-market-data':
            label = 'js-market-data';
            url = 'https://app.intotheblock.com/widget.js';
            break
    }
    try {
        const script = await client.get(label);
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

const clearJS = async (req, res) => {
    let label
    switch(req.url) {
        case '/js-main-clear':
            label = 'js-main';
            break;
        case '/js-landing-clear':
            label = 'js-landing';
            break;
        case '/js-prices-clear':
            label = 'js-prices';
            break;
        case '/js-market-data-clear':
            label = 'js-market-data';
            break;

    }
    try {
        await client.del(label)
        res.json('deleted')
    } catch (err) {
        console.log(err)
    }
    
}

const fetchJSInfo = async (req, res) => {
    let label
    switch(req.url) {
        case '/js-main-info':
            label = 'js-main';
            break;
        case '/js-landing-info':
            label = 'js-landing';
            break;
        case '/js-prices-info':
            label = 'js-prices';
            break;
        case '/js-market-data-info':
            label = 'js-market-data';
            break;
    }
    try {
        const response = await client.MEMORY_USAGE(label);
        console.log(response)
        if (response != null) {
            res.json(response);
        } else {
            res.json('Hit Refetch');
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {fetchPage, clearPage, fetchJS, fetchJSInfo, clearJS}
