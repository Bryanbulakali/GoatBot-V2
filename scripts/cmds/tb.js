let isActive = false;
let modoID = null;
let modoName = "";
let scoreboard = {};

function renderTable() {
  const header = `🎯⚡𝗤𝗨𝗜𝗭𝗭 𝗠𝗘𝗖𝗛𝗔⚡🎯\n\n𝕄𝕆𝔻𝕆: @${modoName}`;

  const participantLines = Object.entries(scoreboard)
    .sort((a, b) => b[1] - a[1])
    .map(([name, points]) => `♻️ ${name} — ${points} pts`);

  const middle = participantLines.length > 0
    ? participantLines.join("\n")
    : "🎯\n🎯\n🎯\n🎯\n🎯\n🎯";

  const footer = `
___________________________

𝕄𝕆𝔻𝕆 𝔸𝕃𝕃 
𝕆ℝ𝕋ℍ𝕆 ✅
𝕄𝔼𝕊𝕊𝔸𝔾𝔼𝕊 𝔻𝔼𝕋𝔸ℂℍ𝔼𝕊 ✅
𝕃𝕆𝕋𝕆 ✅

🏆 [ ${isActive ? "HAJIME" : "FIN"} ]🏆`;

  return `${header}\n\n___________________________\n\n${middle}\n\n${footer}`;
}

module.exports = {
  config: {
    name: "tb",
    version: "3.0.0",
    hasPermission: 1,
    credits: "Bryan + Merdi",
    description: "Tableau MMRN dynamique et illimité",
    commandCategory: "game",
    usages: "tb | tb start | tb end",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID, senderName } = event;

    if (!args[0]) {
      return api.sendMessage(`ℹ️ Tape "tb start" pour activer le tableau.`, threadID);
    }

    if (args[0] === "start") {
      if (isActive)
        return api.sendMessage("❗ | Une session est déjà en cours.", threadID);

      isActive = true;
      modoID = senderID;
      modoName = senderName;
      scoreboard = {};

      return api.sendMessage(renderTable(), threadID);
    }

    if (args[0] === "end") {
      if (!isActive)
        return api.sendMessage("⚠️ | Aucune session n’est active.", threadID);

      isActive = false;

      let winnerText = "Aucun gagnant.";
      if (Object.keys(scoreboard).length > 0) {
        const winner = Object.entries(scoreboard).sort((a, b) => b[1] - a[1])[0];
        winnerText = `🥇 Le gagnant est ${winner[0]} avec ${winner[1]} pts !`;
      }

      return api.sendMessage(`${renderTable()}\n\n${winnerText}`, threadID);
    }
  },

  onChat: async function ({ api, event }) {
    const { senderID, body, threadID } = event;
    if (!isActive || senderID !== modoID) return;

    const message = body?.trim();
    if (!message) return;

    // GIVE +10
    if (message.toLowerCase().startsWith("@give ")) {
      const name = message.slice(6).trim();
      if (!name) return api.sendMessage("❗ | Utilise : @give Nom", threadID);

      scoreboard[name] = (scoreboard[name] || 0) + 10;

      return api.sendMessage(`✅ +10 pts pour ${name} !\n\n${renderTable()}`, threadID);
    }

    // REMOVE -10
    if (message.toLowerCase().startsWith("@remove ") || message.toLowerCase().startsWith("@-10 ")) {
      const name = message.slice(message.toLowerCase().startsWith("@remove ") ? 8 : 5).trim();
      if (!scoreboard[name]) {
        return api.sendMessage(`⚠️ | ${name} n’est pas dans le tableau.`, threadID);
      }

      scoreboard[name] -= 10;
      if (scoreboard[name] <= 0) delete scoreboard[name];

      return api.sendMessage(`➖ -10 pts pour ${name}\n\n${renderTable()}`, threadID);
    }

    // DELETE PLAYER
    if (message.toLowerCase().startsWith("@delete ")) {
      const name = message.slice(8).trim();
      if (!scoreboard[name]) {
        return api.sendMessage(`❌ | ${name} n’est pas dans le tableau.`, threadID);
      }

      delete scoreboard[name];
      return api.sendMessage(`🗑️ ${name} a été retiré du tableau.\n\n${renderTable()}`, threadID);
    }

    // SET POINTS
    if (message.toLowerCase().startsWith("@set ")) {
      const data = message.slice(5).split(":");
      if (data.length !== 2) {
        return api.sendMessage(`❗ | Utilise : @set Nom:Points`, threadID);
      }

      const name = data[0].trim();
      const points = parseInt(data[1]);

      if (isNaN(points)) {
        return api.sendMessage(`⚠️ | Nombre de points invalide.`, threadID);
      }

      scoreboard[name] = points;
      return api.sendMessage(`🔧 ${name} a maintenant ${points} pts.\n\n${renderTable()}`, threadID);
    }
  }
};
