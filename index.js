const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Todo  Server On Fire");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const run = () => {
  const toDoCollection = client.db("To-do").collection("all-toDo");

  try {
    app.get("/api/v1/toDos", async (req, res) => {
      const query = {};
      const result = await toDoCollection.find(query).toArray();
      res.send(result);
    });
    app.post("/api/v1/toDos", async (req, res) => {
      const toDo = req.body;
      const result = await toDoCollection.insertOne(toDo);
      res.send(result);
    });
    app.delete("/api/v1/toDos/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await toDoCollection.deleteOne(filter);
      res.send(result);
    });

    app.put("/api/v1/toDos/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      console.log(req.body);
      const filter = { _id: ObjectId(id) };
      console.log(filter);
      const updatedDoc = {
        $set: {
          toDo: updated.updatedToDo,
        },
      };
      const options = { upsert: true };

      const result = await toDoCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/api/v1/toDos/complete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          isCompleted: true,
        },
      };
      const result = await toDoCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
  } finally {
  }
};
run();

app.listen(PORT, () => {
  console.log(`Todo server Running On Port ${PORT} `);
  client.connect((err) => {
    if (err) {
      return console.log(err);
    }
    console.log("Connected To Database");
  });
});
