const fs = require("fs");
const path = require("path");

const activeSessions = {};

module.exports = {
  config: {
    name: "cg",
    role: "0",
    author: "Merdi Madimba or Bryan Bulakali",
    version: "2.1",
    description: "Quiz de culture générale depuis cg.json avec réponses multiples",
    category: "🎮 Jeu"
  },

  onStart: async function ({ event, message }) {
    const threadID = event.threadID;

    if (activeSessions[threadID]) {
      return message.reply("❗ Un quiz est déjà en cours !");
    }

    await message.send(
      "𝗘𝘁𝗲𝘀-𝘃𝗼𝘂𝘀 𝗽𝗿𝗲̂𝘁𝘀 𝗮̀ 𝗰𝗼𝗺𝗺𝗲𝗻𝗰𝗲𝗿 𝗹𝗲 𝗾𝘂𝗶𝘇 𝗱𝗲 𝗰𝘂𝗹𝘁𝘂𝗿𝗲 𝗴𝗲́𝗻𝗲́𝗿𝗮𝗹𝗲 ?\n\nTapez `!start` pour commencer et `!stop` pour arrêter."
    );

    activeSessions[threadID] = { status: "waiting" };
  },

  onChat: async function ({ event, message, usersData }) {
    const threadID = event.threadID;
    const session = activeSessions[threadID];

    if (!session) return;

    const normalize = str =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    const body = event.body?.toLowerCase().trim();

    // STOP
    if (body === "!stop") {
      clearTimeout(session.timeoutID);
      delete activeSessions[threadID];
      return message.reply("🛑 Quiz arrêté.");
    }

    // START
    if (session.status === "waiting" && body === "!start") {
      const filePath = path.join(__dirname, "..", "data", "cg.json");

      if (!fs.existsSync(filePath)) {
        delete activeSessions[threadID];
        return message.reply("❌ Fichier cg.json introuvable.");
      }

      let questions;
      try {
        questions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (e) {
        delete activeSessions[threadID];
        return message.reply("❌ Erreur de lecture dans cg.json");
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        delete activeSessions[threadID];
        return message.reply("❌ Aucune question trouvée dans cg.json.");
      }

      const selected = [...questions].sort(() => Math.random() - 0.5).slice(0, 60);
      const scores = {};
      let currentIndex = 0;
      let answered = false;
      let currentQuestion = null;

      const sendQuestion = async () => {
        if (currentIndex >= selected.length) {
          const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
          let result = "🏁 Fin du quiz ! Résultat final :\n";
          for (const [name, score] of sorted) {
            result += `🏅 ${name} : ${score} pts\n`;
          }
          result += `👑 Vainqueur : ${sorted[0]?.[0] || "Aucun"}`;
          await message.send(result);
          delete activeSessions[threadID];
          return;
        }

        answered = false;
        currentQuestion = selected[currentIndex];

        await message.send(`❓ Question ${currentIndex + 1} : ${currentQuestion.question}`);

        session.timeoutID = setTimeout(async () => {
          if (!answered) {
            const correctAnswer = Array.isArray(currentQuestion.answer)
              ? currentQuestion.answer[0]
              : currentQuestion.answer;
            await message.send(`⏰ Temps écoulé ! La bonne réponse était : ${correctAnswer}`);
            currentIndex++;
            sendQuestion();
          }
        }, 10000);
      };

      session.status = "playing";
      session.sendQuestion = sendQuestion;
      session.currentQuestion = () => currentQuestion;
      session.currentIndex = () => currentIndex;
      session.updateIndex = () => { currentIndex++; };
      session.scores = scores;
      session.answered = () => answered;
      session.setAnswered = val => { answered = val; };

      sendQuestion();
      return;
    }

    // Pendant le quiz
    if (session.status === "playing" && session.currentQuestion) {
      const currentQ = session.currentQuestion();
      if (!currentQ || session.answered()) return;

      const userAnswer = normalize(event.body || "");
      const expectedAnswers = Array.isArray(currentQ.answer)
        ? currentQ.answer.map(normalize)
        : [normalize(currentQ.answer)];

      if (expectedAnswers.includes(userAnswer)) {
        session.setAnswered(true);
        clearTimeout(session.timeoutID);

        const senderName = await usersData.getName(event.senderID);
        session.scores[senderName] = (session.scores[senderName] || 0) + 10;

        let board = "📊 Score actuel :\n";
        for (let [name, pts] of Object.entries(session.scores)) {
          board += `🏅 ${name} : ${pts} pts\n`;
        }

        await message.reply(`✅ Bonne réponse de ${senderName} !\n\n${board}`);
        session.updateIndex();
        setTimeout(session.sendQuestion, 1000);
      }
    }
  }
};
