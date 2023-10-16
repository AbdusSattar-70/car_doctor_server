const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bn1ubyr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const serviceCollection = client.db('car_doctor').collection('services');
    const bookingCollection = client.db('car_doctor').collection('booking');

    app.get('/service', async (req, res) => {
      const cursor = serviceCollection.find();
      const data = await cursor.toArray();
      res.send(data);
    });

    app.get('/service/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { title: 1, price: 1, service_id: 1 },
      };
      const result = await serviceCollection.findOne(query, options);
      res.send(result);
    });

    app.post('/booking', async (req, res) => {
      const booking = req.body;
    });

    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Car doctor server is running');
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});