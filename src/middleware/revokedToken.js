const logger = require("../config/logger");
const Token = require("../models/token");

// Middleware pour vérifier l'authentification et la révocation
const checkAuthAndRevocation = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const revokedTokens = await Token.findOne();
    if (revokedTokens._doc.token.includes(token)) {
      return res.status(401).json({ message: "Token révoqué. Veuillez vous reconnecter." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const addRevokedToken = async (token) => {
  try {
    const revokedTokensEntry = await Token.findOne(); // Récupérez la première entrée
    // logger.info(revokedTokensEntry)

    if (revokedTokensEntry) {
      // Si une entrée existe, ajoutez le token à la liste
      revokedTokensEntry._doc.token.push(token);
      await revokedTokensEntry.save();
      console.log(`Token révoqué ajouté avec succès: ${token}`);
    } else {
      // Si aucune entrée n'existe, créez-en une nouvelle
      const newRevokedTokensEntry = new Token({ token: [token] });
      await newRevokedTokensEntry.save();
      console.log(`Token révoqué ajouté avec succès: ${token}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du token révoqué:", error);
  }
};


module.exports = { checkAuthAndRevocation, addRevokedToken };
