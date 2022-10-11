const mongoose = require("mongoose");
const { modelName } = require("./User");
const User = require("./User");

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
    shareUsers: {
      type: [Object],
      shareIdUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      shareUsername: {
        type: String,
      },
      // ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);
