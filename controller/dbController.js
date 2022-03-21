
const Redis = require('redis');
const client = Redis.createClient({
    url: process.env.REDIS_URL
})
client.connect(); 
client.on('error', (err) => console.log('Redis Client Error', err));

const flushAll = async (req, res) => {
    try {
        await client.flushAll();
        res.json('Db Flushed');
    } catch (err) {
        console.log(err);
    }
}

module.exports = { flushAll }

