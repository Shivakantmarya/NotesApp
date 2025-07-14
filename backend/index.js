const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

require("dotenv").config();

const app = express();
app.use(cors({
     origin : process.env.CORS_ORIGIN
}));
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongoose is connected!");
  })
  .catch((e) => {
    console.log("server error", e);
  });

//User Router

const router = require('./routes/user');
app.use("/api/user", router);  

//Notes Router

const router1 = require('./routes/note');
app.use("/api/notes", router1);

app.use("/uploads", express.static("uploads"));


app.listen(PORT, () => {
  console.log(`app is listenning on PORT ${PORT}`);
});
