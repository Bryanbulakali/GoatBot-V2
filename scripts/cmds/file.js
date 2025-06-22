const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "file",
    aliases: [],
    version: "1.3",
    author: "TonNom",
    countDown: 5,
    role: 1,
    shortDescription: "📄 Affiche le code d'une commande",
    longDescription: "Montre directement le code source d'une commande du bot",
    category: "admin",
    guide: "{pn} <nom_de_la_commande>"
  },

  onStart: async function ({ args, message }) {
    const cmdName = args.join(" ").trim().toLowerCase();

    if (!cmdName || cmdName.includes(".js")) {
      return message.reply("❌ Indique le nom d'une commande valide sans '.js'.\nExemple : !file help");
    }

    const filePath = path.join(__dirname, `${cmdName}.js`);

    if (!fs.existsSync(filePath)) {
      return message.reply(`❌ Le fichier de la commande "${cmdName}.js" est introuvable.`);
    }

    try {
      const code = fs.readFileSync(filePath, "utf8");

      // Si trop long, on coupe pour éviter les erreurs Messenger
      const maxLength = 15000;
      if (code.length > maxLength) {
        return message.reply("⚠️ Le code est trop long pour être affiché ici.");
      }

      return message.reply(`📄 Code de la commande "${cmdName}":\n\n` + code);
    } catch (err) {
      console.error("Erreur lecture fichier :", err);
      return message.reply("❌ Une erreur est survenue lors de la lecture du fichier.");
    }
  }
};
