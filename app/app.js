require("dotenv").config();
const express = require("express");
const { connect } = require("mongoose");

async function run() {
  try {
    await connect(
      process.env.MONGO_URI,
      { useUnifiedTopology: true, useNewUrlParser: true },
    );
    const app = express();

    app.use(express.json());

    app.listen(process.env.PORT, () => console.log("GameRate API Running"));
  } catch (e) {
    console.log(e);
  }
}

run();
