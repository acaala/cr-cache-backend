const { default: axios } = require('axios');
const Redis = require('redis');
const geoip = require('geopip-lite');
const client = Redis.createClient({
    url: process.env.REDIS_URL
}
)
client.connect(); 
client.on('error', (err) => console.log('Redis Client Error', err));

// let url = `${process.env.BASE_URL}/poker-events/api/${process.env.API_KEY}/`
let url = `https://jsonplaceholder.typicode.com/photos`

const cache = async (req, res) => {
    let geo = geoip.lookup(req.headers['x-forwarded-for'])
    console.log(geo)
    try {
        let start = Date.now();
        const response = await client.get('photos');
        if(response != null) {
            const uncached = await client.get('photosUncached');
            res.json({response: JSON.parse(response), time: Date.now() - start, uncached, geo})
        } else {
            const response = await axios.get(`${url}`);
            client.set('photos', JSON.stringify(response.data));

            let uncached = Date.now() - start;

            client.set('photosUncached', JSON.stringify(uncached))
            res.json({response: response.data, time: uncached, uncached, geo});
        }
    } catch (err) {
        console.log(err);
    }
}

const clearCache = async (req, res) => {
    try {
        await client.del('photos');
        const uncached = await client.get('photosUncached');
        res.json({time: '-', uncached});
    } catch (err) {
        console.log(err);
    }
}

module.exports = { cache, clearCache }