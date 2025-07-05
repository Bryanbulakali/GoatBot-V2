const fs = require("fs");
const path = require("path");

const activeSessions = {};

module.exports = {
  config: {
    name: "cg",
    role: "0",
    author: "Merdi Madimba or Bryan Bulakali",
    version: "2.0",
    description: "Quiz de culture générale depuis cg.json avec réponses multiples",
    category: "🎮 Jeu"
  },

  onStart: async function ({ event, message }) {
    const threadID = event.threadID;

    if (activeSessions[threadID]) {
      return message.reply("❗ Un quiz est déjà en cours !");
    }

    await message.send(
      "𝗘𝘁𝗲𝘀-𝘃𝗼𝘂𝘀 𝗽𝗿𝗲𝘁 𝗮 𝗰𝗼𝗺𝗺𝗲𝗻𝗰𝗲𝗿 𝗹𝗲 𝗾𝘂𝗶𝘇 𝗰𝘂𝗹𝘁𝘂𝗿𝗲 𝗴𝗲𝗻𝗲𝗿𝗮𝗹𝗲 ?\n\nTapez `!start` pour commencer et `!stop` pour arrêter."
    );

    activeSessions[threadID] = { status: "waiting" };
  },

  onChat: async function ({ event, message, usersData }) {
    const threadID = event.threadID;
    const session = activeSessions[threadID];

    if (!session) return;

    const normalize = str =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    // STOP
    if (event.body.toLowerCase() === "!stop") {
      delete activeSessions[threadID];
      return message.reply("🛑 Quiz arrêté.");
    }

    // START
    if (session.status === "waiting" && event.body.toLowerCase() === "!start") {
      let filePath = path.join(__dirname, "..", "data", "cg.json");

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
      let currentQuestion = null;
      let answered = false;
      let timeoutID = null;

      const sendQuestion = async () => {
        if (currentIndex >= selected.length) {
          const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
          let result = "🏁 Fin du quiz ! Résultat final :\n";
          for (let [name, score] of sorted) {
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

        timeoutID = setTimeout(async () => {
          if (!answered) {
            const correct =
              Array.isArray(currentQuestion.answer) ? currentQuestion.answer[0] : currentQuestion.answer;
            await message.send(`⏰ Temps écoulé ! La bonne réponse était : ${correct}`);
            currentIndex++;
            sendQuestion();
          }
        }, 10000);
      };

      activeSessions[threadID] = async ({ event, message }) => {
        if (!currentQuestion || answered) return;

        const senderName = await usersData.getName(event.senderID);
        const msg = event.body || "";
        const userAnswer = normalize(msg);

        const expectedAnswers = Array.isArray(currentQuestion.answer)
          ? currentQuestion.answer.map(normalize)
          : [normalize(currentQuestion.answer)];

        if (expectedAnswers.includes(userAnswer)) {
          answered = true;
          clearTimeout(timeoutID);
          scores[senderName] = (scores[senderName] || 0) + 10;

          let board = "📊 Score actuel :\n";
          for (let [name, pts] of Object.entries(scores)) {
            board += `🏅 ${name} : ${pts} pts\n`;
          }

          await message.reply(`✅ Bonne réponse de ${senderName} !\n\n${board}`);
          currentIndex++;
          setTimeout(sendQuestion, 1000);
        }
      };

      session.status = "playing";
      session.handler = activeSessions[threadID];
      sendQuestion();
      return;
    }

    // Pendant le quiz
    if (session.status === "playing" && typeof session.handler === "function") {
      session.handler({ event, message, usersData });
    }
  }
};
