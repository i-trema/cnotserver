const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

/// "trigger" pour chiffrer le mdp avant de sauvegarder sur la bdd :
/// ( on ne peut pas utiliser une fonction fléchée )
userSchema.pre("save", async function () {
  // vérifier si le mdp est nouveau pour ne pas chiffrer un mdp deux fois :
  if (this.isModified("password")) {
    // chiffrer le mdp :
    this.password = await bcrypt.hash(this.password, 10);
  }
});

module.exports = mongoose.model("User", userSchema);
