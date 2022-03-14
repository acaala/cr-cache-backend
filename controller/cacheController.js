const { default: axios } = require('axios');
const Redis = require('redis');
const geoip = require('geoip-lite');
// const client = Redis.createClient()
const client = Redis.createClient({
    url: process.env.REDIS_URL
}
)
client.connect(); 
client.on('error', (err) => console.log('Redis Client Error', err));

// let url = `${process.env.BASE_URL}/poker-events/api/${process.env.API_KEY}/`
let url = `https://jsonplaceholder.typicode.com`

const cache = async (req, res) => {
    let geo = geoip.lookup(req.headers['x-forwarded-for'])
    let endpoint
    if(req.url == '/cachePhotos') {
        endpoint = 'photos';
    } else if(req.url == '/cachePosts') {
        endpoint = 'posts';
    }
    try {
        let start = Date.now();
        const response = await client.get(endpoint);
        if(response != null) {
            const uncached = await client.get(`${endpoint}Uncached`);
            res.json({response: JSON.parse(response), time: Date.now() - start, uncached, geo})
        } else { 
            const response = await axios.get(`${url}/${endpoint}`);
            client.set(endpoint, JSON.stringify(response.data));

            let uncached = Date.now() - start;

            client.set(`${endpoint}Uncached`, JSON.stringify(uncached))
            res.json({response: response.data, time: uncached, uncached, geo});
        }
    } catch (err) {
        console.log(err);
    }
}

const clearCache = async (req, res) => {
    let endpoint
    if(req.url == '/clearCachePhotos') {
        endpoint = 'photos';
    } else if(req.url == '/clearCachePosts') {
        endpoint = 'posts';
    }
    try {
        await client.del(endpoint);
        const uncached = await client.get(`${endpoint}Uncached`);
        res.json({time: '-', uncached});
    } catch (err) {
        console.log(err);
    }
}

module.exports = { cache, clearCache }