const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      require: true,
    },
    contenu: {
      type: String,
    },
    tag: {
      type: [String],
    },
    couleur: {
      type: Number,
      default: 1,
    },
    //// on ajoute une clé étrangère qui fera référence à l'id de la collection User
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    idCategorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
    },
    idUserShare: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);
