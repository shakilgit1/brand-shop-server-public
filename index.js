const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvn4ffv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    const allBrands = client.db("brandsDB").collection("brands");
    const myCarts = client.db("myCartsDB").collection("carts");
    const allTechnologies = client.db("technologiesDB").collection("technologies");

   // read
  app.get('/brands', async(req, res) =>{
      const cursor = allBrands.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.post('/brands', async(req, res) =>{
      const products = req.body;
      const result = await allBrands.insertOne(products);
      res.send(result);
  })
  app.get('/brands/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await allBrands.findOne(query);
    res.send(result);
  })


    // all data collections
    app.get('/technologies', async(req, res) =>{
        const cursor = allTechnologies.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.post('/technologies', async(req, res) =>{
        const products = req.body;
        const result = await allTechnologies.insertOne(products);
        res.send(result);
    })
    app.get('/technologies/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await allTechnologies.findOne(query);
      res.send(result);
    })
    app.put('/technologies/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateProduct = req.body;
      const updateDoc = {
        $set: {
          name: updateProduct.name,
          brand: updateProduct.brand,
          type: updateProduct.type,
          rating: updateProduct.rating,
          image: updateProduct.image,
          price: updateProduct.price,
          description: updateProduct.description,
        },
      };
    const result = await allTechnologies.updateOne(filter, updateDoc, options);
    res.send(result);
    })

    // add to cart 
    app.post('/carts', async(req, res) =>{
      const item = req.body;
      // item._id = new ObjectId(item._id)
      const result = await myCarts.insertOne(item);
      res.send(result);
    })
    app.get('/carts', async(req, res) =>{
      const cursor = myCarts.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/carts/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: (id)};
      const result = await myCarts.findOne(query);
      res.send(result);
    })
    app.delete('/carts/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: (id)};
      const result = await myCarts.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand shop server is running')
  })
  
app.listen(port, () => {
    console.log(`Brand shop server is running ${port}`)
  })

