const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      require: true,
    },
    couleur: {
      type: Number,
      default: 1,
    },
    //// on ajoute une clé étrangère qui fera référence à l'id de la collection User
    // idUser: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Categorie", noteSchema);
