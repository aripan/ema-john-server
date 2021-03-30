const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@emajohncluster.tvrro.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  app.post("/addProducts", (req, res) => {
    const products = req.body;
    productsCollection
      .insertMany(products)
      .then((result) => console.log("success"));
  });

  app.post("/productByKeys", (req, res) => {
    const productKeys = req.body;
    console.log(productKeys);
    productsCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => res.send(documents));
  });

  app.get("/products", (req, res) => {
    productsCollection
      .find({})
      .toArray((err, documents) => res.send(documents));
  });
  app.get("/products/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => res.send(documents[0]));
  });

  app.post("/newOrders", (req, res) => {
    const newOrder = req.body;
    ordersCollection
      .insertOne(newOrder)
      .then((result) => res.send(result.insertedCount > 0));
  });

  console.log("Database connected");
});

app.get("/", (req, res) => {
  res.send("Hello Ema John");
});

app.listen(process.env.PORT || port, () => {
  console.log(`listening at ${port}`);
});
