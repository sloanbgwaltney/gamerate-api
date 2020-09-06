require("dotenv").config();
const express = require("express");
const { connect } = require("mongoose");
const { userRouter } = require('./router/userRouter')
const { securityRouter } = require('./router/securityRouter')
const { validateRequestor } = require('./lib/validateRequestor')

async function run() {
  try {
    await connect(
      process.env.MONGO_URI,
      { useUnifiedTopology: true, useNewUrlParser: true },
    );
    const app = express();

    app.use(express.json());
    app.use(validateRequestor());

    app.use("/api/v1/users", userRouter)
    app.use("/api/v1/security", securityRouter)
    app.listen(process.env.PORT, () => console.log("GameRate API Running"));
  } catch (e) {
    console.log(e);
  }
}

run();
