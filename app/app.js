require("dotenv").config();
const express = require("express");
const { connect } = require("mongoose");
const passport = require('passport')
const { userRouter } = require('./router/userRouter')
const { securityRouter } = require('./router/securityRouter')
const { gameProfileRouter } = require('./router/gameProfileRouter')

async function run() {
  try {
    await connect(
      process.env.MONGO_URI,
      { useUnifiedTopology: true, useNewUrlParser: true },
    );
    const app = express();
    app.use(passport.initialize())
    app.use(express.json());

    app.use("/api/v1/users", userRouter)
    app.use("/api/v1/security", securityRouter)
    app.use("/api/v1/gameProfile", gameProfileRouter)

    app.listen(process.env.PORT, () => console.log("GameRate API Running"));
  } catch (e) {
    console.log(e);
  }
}

run();
