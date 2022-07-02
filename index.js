require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const uri = "mongodb://localhost:27017/dbMern";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à la BDD établie"))
  .catch((error) => console.log(error));

const userRoute = require("./routes/userRoute");
app.use("/user", userRoute);

const noteRoute = require("./routes/noteRoute");
app.use("/note", noteRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Le serveur est lancé sur le port ${PORT}`));
