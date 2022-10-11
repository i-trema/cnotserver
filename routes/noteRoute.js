const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/auth");

//// Création d'une note :
router.post("/note", auth, async (req, res) => {
  try {
    req.body.idUser = req.payload.id;
    const note = new Note(req.body);

    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Lister toutes les notes ( on peut les trier avec .sort())
router.get("/", async (req, res) => {
  try {
    const listeNotes = await Note.find().sort("createdAt");
    res.json(listeNotes);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Récupérer les notes du user connecté
router.get("/getNoteUser", auth, async (req, res) => {
  try {
    const notes = await Note.find({ idUser: req.payload.id });

    res.json(notes);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Récupérer les notes partagées avec le user connecté
router.get("/getNoteUserShare", auth, async (req, res) => {
  try {
    console.log(req.payload.id);
    console.log(req.payload);
    // const notes = await Note.find({
    //   shareUsers: {
    //     shareIdUser: req.payload.id,
    //     // shareUsername: "aaaaaa",
    //   },
    // });
    const notes = await Note.find({
      shareUsers: { $elemMatch: { shareIdUser: req.payload.id } },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json(error.message);

    return false;
  }
});

//// Récupérer une note avec son id
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json("Cette note n'existe pas");
    }
    res.json(note);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Supprimer une note (si elle existe)
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json("Cette note n'existe pas");
    }
    /// on ne peut pas mettre "!==" car ils n'ont pas le même type:
    if (note.idUser != req.payload.id) {
      return res.status(401).json("Cette note ne vous appartient pas");
    }
    await note.remove();
    res.status(200).json("note supprimée");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Mettre à jour une note
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json("Cette note n'existe pas");
    }
    if (
      note.idUser != req.payload.id &&
      !note.idUserShare.includes(req.payload.id)
    ) {
      return res.status(401).json("Cette note ne vous appartient pas");
    }
    await note.updateOne(req.body);

    res.json(note);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
