const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // extraire le token du Header "authorization" :
    const token = req.headers.authorization.split(" ")[1];
    // vérifier la validité du token ( avec la clé utilisée lors de de la
    // création du token ) :
    jwt.verify(token, process.env.PRIVATE_KEY, (err, payload) => {
      if (err) {
        return res.status(401).json("Unauthorized");
      }

      req.payload = payload;
      next();
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = auth;
