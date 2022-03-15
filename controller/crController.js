const cheerio = require('cheerio');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Redis = require('redis');
const client = Redis.createClient({
    url: process.env.REDIS_URL
})
client.connect(); 
client.on('error', (err) => console.log('Redis Client Error', err));

let url = 'https://development.coinrivet.com';

const fetchHome = async (req, res) => {
    try {
        let start = Date.now();
        const response = await client.get('cr-home');
        if(response != null) {
            const uncachedHomePageTime = await client.get('uncachedHomePageTime')
            res.json({response: JSON.parse(response), time: Date.now() - start, uncachedHomePageTime})
        } else {
            const homePage = await fetch(url);
            const body = await homePage.text();
            const $ = cheerio.load(body);

            const signUp = $('<div class="grid-x grid-margin-x align-middle site-header__login-buttons">')
            
            client.set('cr-home', JSON.stringify($.html()));

            let uncachedHomePageTime = Date.now() - start;
            client.set('uncachedHomePageTime', JSON.stringify(uncachedHomePageTime))
            res.json({response: body, time: uncachedHomePageTime, uncachedHomePageTime});
        }

    } catch (err) {
        console.log(err);
    }
    // const $ = cheerio.load(body);
    // console.log($);
}

const clearHome = async (req, res) => {
    try {
        await client.del('cr-home');
        const uncached = await client.get('uncachedHomePageTime');
        res.json({time: '-', uncachedHomePageTime: uncached});
    } catch (err) {
        console.log(err);
    }
}

module.exports = {fetchHome, clearHome}