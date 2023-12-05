const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON data

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9bycbcd.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollection = client.db("mobileBrandDB").collection("users");
    const brandCollection = client.db("mobileBrandDB").collection("brands");
    const productCollection = client.db("mobileBrandDB").collection("products");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.patch("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      console.log(filter);
      const updateDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = userCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/brand-name", async (req, res) => {
      const cursor = brandCollection.find();
      const brands = await cursor.toArray();
      console.log(brands);
      res.send(brands);
    });

    app.get("/brand-name/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    app.post("/brand-name", async (req, res) => {
      const brandName = req.body;
      console.log(brandName);
      const result = await brandCollection.insertOne(brandName);
      res.send(result);
    });

    app.get("/add-product", async (req, res) => {
      const cursor = productCollection.find();
      const product = await cursor.toArray();
      res.send(product);
    });

    app.post("/add-product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Close the client when finished
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
