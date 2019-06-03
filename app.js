const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });

const app = express()
let DB = null;

app.use(async (req, res, next) => {
    try {
        if (DB) {
            req.DB = DB;
        } else {
            await client.connect();
            DB = client.db('test');
            req.DB = DB;
        }
        next()
    } catch (error) {
        console.log(error)
    }

})

app.get('/', async (req, res) => {
    const doc = await req.DB.collection('snapshots').findOne({})
    res.json(doc)
})

app.get('/all', async (req, res) => {
    const docs = await req.DB.collection('snapshots').find({}).toArray()
    res.json(docs)
})

app.listen(3000, () => console.log('listening on 3000'))
