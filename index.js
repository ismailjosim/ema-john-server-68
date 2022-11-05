// All required
require('colors');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// create app and port
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())



// create uri and client
const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASSWORD }@cluster0.s9x13go.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// connect database
const dbConnect = async () => {
    try {
        await client.connect();
        console.log('Ema-john server is running'.rainbow.italic);

    } catch (error) {
        console.log(error.name, error.message);
    }
}

dbConnect();

//============> Database collections
const ProductCollection = client.db('emaJohnProducts').collection('products');


//======> Read Data
app.get('/', (req, res) => {
    res.send('Ema John Database Working!')
})

//======> Get All Products data
app.get('/products', async (req, res) => {
    try {
        const query = {}

        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
        // console.log(page, size);

        const cursor = ProductCollection.find(query);
        const products = await cursor.skip(page * size).limit(size).toArray();
        const count = await ProductCollection.estimatedDocumentCount();

        res.send({
            success: true,
            count: count,
            products: products
        })
    } catch (error) {

        console.log(error.name, error.message);

        res.send({
            success: false,
            error: error.message
        })
    }

})

// query products id for local storage
app.post('/productsByIds', async (req, res) => {
    try {
        const ids = req.body;
        const objIds = ids.map(id => ObjectId(id));
        const query = { _id: { $in: objIds } };
        const cursor = ProductCollection.find(query);
        const products = await cursor.toArray();

        res.send(products);

    } catch (error) {
        console.log(error.name, error.message);

        res.send({
            success: false,
            error: error.message
        })
    }
})


app.listen(port, () => console.log(`Server Running On PORT ${ port }`.cyan.bold.italic))

