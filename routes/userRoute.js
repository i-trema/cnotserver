const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//// Création d'un user :
router.post("/register", async (req, res) => {
  try {
    const searchUser = await User.findOne({ username: req.body.username });
    if (searchUser) {
      res
        .status(403)
        .json("L'utilisateur " + req.body.username + " existe déjà...");
      return;
    }
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

router.get("/privacy/en", async (req, res) => {
  try {
    res.setHeader("Content-type", "text/html");
    res.send(
      "<p>C.No.T! Privacy Policy <br />Posted: October 24, 2022 <br />ianis m <br /><br />Thanks for using C.No.T! Here we describe how we collect, use and handle your information when you use our application. <br /><br />What & Why We <br />collect email, username and password that you enter in the Signup page (authentification/inscription) to create a user account and find your Notes. We collect these informations and your Notes to store it in a private online database. <br /><br /> With whom <br />Your user account and your Notes are stored in a MongoDB database. Password is crypted in the database so we can't know it. <br /><br />Retention. <br />We'll retain information you store on our Services for as long as we need it to provide you the Services. If you delete your account, we'll also delete this information. But please note: (1) there might be some latency in deleting this information from our servers and back-up storage; and (2) we may retain this information if necessary to comply with our legal obligations, resolve disputes, or enforce our agreements.<br /><br />Where <br />Around the world. To provide you with the Services, we may store, process and transmit information in locations around the world - including those outside your country. Information may also be stored locally on the devices you use to access the Services.<br /><br />Changes <br />If we are involved in a reorganization, merger, acquisition or sale of our assets, your information may be transferred as part of that deal. We will notify you (for example, via a message to the email address associated with your account) of any such deal and outline your choices in that event. We may revise this Privacy Policy from time to time, and will post the most current version on our website. If a revision meaningfully reduces your rights, we will notify you. <br /> <br />Contact<br />Have questions or concerns about C.No.T! ? Contact us at imtest94dev _at_ gmail _dot_ com . </p>"
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
