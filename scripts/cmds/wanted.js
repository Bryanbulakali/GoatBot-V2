const fs = require("fs");
const axios = require("axios");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "wanted",
    version: "1.0",
    author: "Bryan Bulakali",
    countDown: 10,
    role: 0,
    shortDescription: "Cadre Wanted One Piece",
    longDescription: "Ajoute un cadre One Piece Wanted à une photo",
    category: "fun",
    guide: "{p}wanted [montant]\nExemple : {p}wanted 5000"
  },

  onReply: async function ({ api, event, reply, args, message }) {
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments[0].type !== "photo") {
      return message.reply("❌ Tu dois répondre à une image.");
    }

    const amount = args[0] || "5000";
    const money = `$${amount}`;
    const prefix = global.GoatBot.config.prefix || "!"; // utilise le préfixe actuel

    try {
      const imgUrl = event.messageReply.attachments[0].url;
      const photo = await jimp.read((await axios.get(imgUrl, { responseType: "arraybuffer" })).data);
      const wantedFrame = await jimp.read("https://i.imgur.com/oT9lDUI.png"); // cadre wanted

      photo.resize(500, 500);
      wantedFrame.resize(500, 650);

      const canvas = new jimp(500, 650, "#ffffff");
      canvas.composite(photo, 0, 60).composite(wantedFrame, 0, 0);

      const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
      canvas.print(font, 0, 580, {
        text: `WANTED ${money} - ${prefix}`,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
      }, 500);

      const outPath = path.join(__dirname, "cache", `wanted-${event.senderID}.png`);
      await canvas.writeAsync(outPath);

      await message.reply({
        body: `🎯 Prime : ${money} - ${prefix}`,
        attachment: fs.createReadStream(outPath)
      });

      fs.unlinkSync(outPath);
    } catch (e) {
      console.log(e);
      message.reply("❌ Une erreur est survenue.");
    }
  },

  onStart({ message, event, args, api }) {
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments[0].type !== "photo") {
      return message.reply("⚠️ Tu dois répondre à une image avec la commande.");
    }

    message.reply("🖼️ Génération de l'affiche WANTED en cours...", (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "wanted",
        messageID: info.messageID,
        author: event.senderID,
        args
      });
    });
  }
};
