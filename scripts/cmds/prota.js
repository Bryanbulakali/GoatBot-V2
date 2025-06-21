const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "prota",
    version: "2.2.0",
    hasPermission: 1,
    credits: "Bryan",
    description: "Quiz sur les protagonistes de mangas",
    commandCategory: "game",
    usages: "prota <facile/difficile> <10/20/30>",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(e => e.id == senderID);
    if (!isAdmin)
      return api.sendMessage("❌ Seuls les administrateurs peuvent utiliser cette commande.", threadID, messageID);

    const niveau = args[0]?.toLowerCase();
    const nombre = parseInt(args[1]);

    if (!niveau || !["facile", "difficile"].includes(niveau))
      return api.sendMessage("❗Veuillez indiquer un niveau valide : `facile` ou `difficile`", threadID, messageID);

    if (![10, 20, 30].includes(nombre))
      return api.sendMessage("❗Nombre de questions invalide. Choisissez entre 10, 20 ou 30.", threadID, messageID);

    const filePath = path.join(__dirname, "data", "protagonistes.json");
    if (!fs.existsSync(filePath)) {
      return api.sendMessage("❌ Fichier des questions introuvable.", threadID, messageID);
    }

    const allQuestions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const questions = allQuestions
      .filter(q => niveau === "facile" ? q.level === "easy" : q.level === "hard")
      .sort(() => 0.5 - Math.random())
      .slice(0, nombre);

    const intro = `♨️⚔️🐥⚡QUIZ PROTA⚡🐥⚔️♨️

𝕄𝕆𝔻𝕆: ${niveau.toUpperCase()}
___________________________

𝕄𝕆𝔻𝕆 𝔸𝕃𝕃
𝕆ℝ𝕋ℍ𝕆 ⛔
𝕄𝔼𝕊𝕊𝔸𝔾𝔼𝕊 𝔻𝔼𝕋𝔸ℂℍ𝔼𝕊 ⛔
𝕃𝕆𝕋𝕆 ⛔

🏆 [ HAJIME ] 🏆

🔁 Répondez à chaque question.`;

    api.sendMessage(intro, threadID, () => {
      askQuestion(api, threadID, senderID, questions, 0, nombre, {}, niveau);
    });
  },

  handleReply: async function ({ api, event, handleReply }) {
    const { body, senderID, threadID } = event;
    const { questions, current, score, total, timer, responded, author, difficulte } = handleReply;

    if (responded.has(senderID)) return;

    const userAnswer = body.trim().toLowerCase();
    const correctAnswer = questions[current].answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      responded.add(senderID);
      score[senderID] = (score[senderID] || 0) + 1;
      clearTimeout(timer);

      return api.sendMessage(`✅ Bonne réponse @${senderID}`, threadID, () => {
        if (current + 1 >= total) {
          sendFinalScore(api, threadID, score);
        } else {
          askQuestion(api, threadID, author, questions, current + 1, total, score, difficulte);
        }
      }, [senderID]);
    }
  }
};

function askQuestion(api, threadID, author, questions, current, total, score, difficulte) {
  const question = questions[current];
  const responded = new Set();

  api.sendMessage(`❓ Question ${current + 1}/${total}\n\n${question.question}`, threadID, (err, info) => {
    const timeout = setTimeout(() => {
      if (current + 1 >= total) {
        sendFinalScore(api, threadID, score);
      } else {
        api.sendMessage("⏱ Temps écoulé. Prochaine question...", threadID, () => {
          askQuestion(api, threadID, author, questions, current + 1, total, score, difficulte);
        });
      }
    }, 10000);

    global.client.handleReply.push({
      name: "prota",
      messageID: info.messageID,
      author,
      questions,
      current,
      score,
      total,
      timer: timeout,
      responded,
      difficulte
    });
  });
}

function sendFinalScore(api, threadID, score) {
  const leaderboard = Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .map(([id, sc], i) => `${i + 1}. @${id} - ${sc} ✅`)
    .join("\n");

  api.sendMessage(`🏁 Fin du Quiz !\n\n🎖️ Résultats :\n${leaderboard}`, threadID, null, Object.keys(score));
  }
