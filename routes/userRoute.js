const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//// Création d'un user :
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error.message);
    return;
  }
});

// Connexion d'un user :
router.post("/login", async (req, res) => {
  try {
    // ( dans le body on va retrouver username et password )
    // - récupérer le user avec son username
    // - vérifier si l'utilisateur existe
    // - vérifier la validité du mdp
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(400).json("Cet utilisateur n'existe pas");
      return;
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json("Mot de passe incorrect");
    }

    const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
    res.json(token);
    console.log("Server \n token : " + token + "\n user._id : " + user._id);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
});

// récupérer l'user à partir du username :
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.json("Cet utilisateur n'existe pas");
      // res.json("Cet utilisateur n'existe pas");

      return;
    }
    res.json(user);
    console.log(user._id);
    console.log(user.username);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// récupérer l'user à partir de son id :
router.get("/idUser/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.json("Cet utilisateur n'existe pas");

      return;
    }
    res.json(user);

    console.log(req.params.id);
    console.log(user._id);
    console.log(user.username);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/api/test", async (req, res) => {
  try {
    res.json("Test OK");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
