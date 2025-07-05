const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "clear",
    aliases: [],
    version: "1.1",
    author: "Bryan Bulakali🎯 & Merdi Madimba🔥",
    role: 2,
    shortDescription: "Nettoie les fichiers inutiles",
    longDescription: "Efface les caches, fichiers temporaires et inutiles du bot",
    category: "système",
    guide: {
      fr: "{pn} : Nettoyer le système après confirmation"
    }
  },

  onStart: async function ({ message, event, usersData, commandName }) {
    if (event.senderID != message.senderID) return;

    message.reply(
      "⚠️ | Veux-tu vraiment nettoyer les fichiers inutiles ?\n\n" +
      "1️⃣ - 𝗢𝘂𝗶 𝗽𝗼𝘂𝗿 𝗰𝗼𝗻𝗳𝗶𝗿𝗺𝗲𝗿\n" +
      "2️⃣ - 𝗡𝗼𝗻 𝗽𝗼𝘂𝗿 𝗮𝗻𝗻𝘂𝗹𝗲𝗿"
    );

    // Sauvegarde de l'état dans une Map temporaire
    global.GoatBot.onReply.set(event.senderID + "_clear_confirm", {
      commandName,
      author: event.senderID
    });
  },

  onReply: async function ({ message, event }) {
    const confirmKey = event.senderID + "_clear_confirm";
    const replyData = global.GoatBot.onReply.get(confirmKey);
    if (!replyData || replyData.commandName !== "clear") return;

    const input = event.body.trim();
    if (input !== "1" && input !== "2") return message.reply("❗ | Choix invalide. Tape 1 pour confirmer ou 2 pour annuler.");

    if (input === "2") {
      global.GoatBot.onReply.delete(confirmKey);
      return message.reply("❌ | Nettoyage annulé.");
    }

    // Confirmation = 1
    const foldersToDelete = ["cache", "tmp", "temp", "logs"];
    let result = "🧹 Nettoyage en cours...\n";

    for (const folder of foldersToDelete) {
      const fullPath = path.join(__dirname, "..", "..", folder);
      if (fs.existsSync(fullPath)) {
        try {
          fs.rmSync(fullPath, { recursive: true, force: true });
          result += `✅ | ${folder} supprimé.\n`;
        } catch (err) {
          result += `❌ | Erreur pour ${folder} : ${err.message}\n`;
        }
      } else {
        result += `⚠️ | ${folder} introuvable.\n`;
      }
    }

    global.GoatBot.onReply.delete(confirmKey);
    return message.reply(result + "\n✅ | Nettoyage terminé !");
  }
};
