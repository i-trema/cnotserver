const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//// Création d'un user :
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);

    // const user = new User({
    //   fullname: req.body.fullname,
    //   email: req.body.email,
    //   password: req.body.password,
    // });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Connexion d'un user :
router.post("/login", async (req, res) => {
  try {
    // ( dans le body on va retrouver email et password )
    // - récupérer le user avec son email
    // - vérifier si l'utilisateur existe
    // - vérifier la validité du mdp
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json("Cet utilisateur n'existe pas");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json("Mot de passe incorrect");
    }

    const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
    res.json(token);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
