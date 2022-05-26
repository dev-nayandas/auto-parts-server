const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pfvoz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

  try {
    await client.connect();
    // Browercollection is here
    const partsCollection =client.db('auto-parts').collection('parts');
    const reviewsCollection =client.db('auto-parts').collection('reviews');
    const userCollection =client.db('auto-parts').collection('users');


    
// get api here
    app.get('/parts', async (req,res)=>{
      const query = {};
      const cursor = partsCollection.find(query)
      const parts = await cursor.toArray()
      res.send(parts)
    })

    app.get('/parts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const part = await partsCollection.findOne(query);
      res.send(part)
  });

    app.get('/reviews', async (req,res)=>{
      const query = {};
      const cursor = reviewsCollection.find(query)
      const reviews = await cursor.toArray()
      res.send(reviews)
    })
    app.get('/users', async (req,res)=>{
      const query = {};
      const cursor = userCollection.find(query)
      const users= await cursor.toArray()
      res.send(users)
    })

    // app.get('/users', async (req, res)=>{
    //   const users = await userCollection.find().toArray();
    //   res.send(users)
    // })

    // make admin api here
    app.put('/user/admin/:email' , async(req, res)=>{
      const email = req.params.email;
      const fiter = {email:email};
      const updateDoc = {
        $set : {role: 'admin'},
      };
      const result = await userCollection.updateOne(fiter,updateDoc);
      res.send(result)
    })

    app.put('/user/:email' , async(req, res)=>{
      const email = req.params.email;
      const user = req.body;
      const fiter = {email:email};
      const options = {upsert : true};
      const updateDoc = {
        $set : user,
      };
      const result = await userCollection.updateOne(fiter,updateDoc,options);
      res.send(result)
    })

  }

  finally {

  }

}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Auto parts running')
})

app.listen(port, () => {
  console.log(`Auto parts listening on port ${port}`)
})