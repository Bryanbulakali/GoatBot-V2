module.exports = {
  config: {
    name: "react",
    aliases: [],
    version: "1.0",
    author: "Bryan Bulakali & Merdi Madimba",
    countDown: 5,
    role: 2, // Admin du bot ou Admin du groupe selon config bot
    shortDescription: {
      fr: "Changer l’émoji rapide du groupe"
    },
    longDescription: {
      fr: "Permet de modifier l’émoji de réaction rapide d’un groupe (admin uniquement)"
    },
    category: "group",
    guide: {
      fr: "{pn} 🐐"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const emoji = args[0];

    if (!emoji) {
      return message.reply("❌ | Veuillez indiquer un émoji. Exemple : !react 🔥");
    }

    if (!event.isGroup) {
      return message.reply("❌ | Cette commande ne peut être utilisée que dans un groupe.");
    }

    try {
      await api.changeThreadEmoji(emoji, event.threadID);
      return message.reply(`✅ | L’émoji de réaction rapide du groupe a été changé en ${emoji}`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ | Impossible de changer l’émoji. Vérifie que le bot a les permissions nécessaires.");
    }
  }
};
