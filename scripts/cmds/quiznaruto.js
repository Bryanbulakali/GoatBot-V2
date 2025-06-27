// ============================ // 📦 Chargement des modules // ============================ const fs = require("fs"); const path = require("path");

function normalize(text) { return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim(); }

const activeSessions = {};

module.exports = { config: { name: "quiznaruto", aliases: ["qna"], role: 0, author: "Merdi Madimba & Bryan Bulakali", version: "1.0", description: "🎮 Quiz difficile sur Naruto avec score", category: "🎮 Jeu" },

onStart: async function ({ event, message, usersData }) { const threadID = event.threadID;

if (activeSessions[threadID]) {
  return message.reply("❗ Un quiz est déjà en cours dans cette conversation !");
}

const filePath = path.join(__dirname, "data", "quiznaruto.json");
let data;
try {
  data = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (err) {
  return message.reply("❌ Erreur lors du chargement des questions Naruto.");
}

const questions = data.filter(q => q.level === "difficile");
const selected = [...questions].sort(() => 0.5 - Math.random()).slice(0, 30);

const scores = {};
let currentIndex = 0;
let currentQuestion = null;
let timeoutID = null;
let answered = false;

const sendQuestion = async () => {
  if (currentIndex >= selected.length) {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    let finalBoard = "🏁 Fin du quiz Naruto ! Résultat final :\n";
    let winner = sorted[0]?.[0] || "Aucun";

    for (let [name, pts] of sorted) {
      finalBoard += `🏅 ${name} : ${pts} pts\n`;
    }

    finalBoard += `\n👑 Vainqueur : ${winner}`;
    await message.send(finalBoard);
    delete activeSessions[threadID];
    return;
  }

  answered = false;
  currentQuestion = selected[currentIndex];

  await message.send(`❓ Question ${currentIndex + 1} : ${currentQuestion.question}`);

  timeoutID = setTimeout(async () => {
    if (!answered) {
      await message.send(`⏰ Temps écoulé ! La bonne réponse était : ${currentQuestion.answer}`);
      currentIndex++;
      sendQuestion();
    }
  }, 10000);
};

activeSessions[threadID] = async ({ event, message }) => {
  if (!currentQuestion || answered) return;

  const senderName = await usersData.getName(event.senderID);
  const msg = normalize(event.body);

  if (normalize(currentQuestion.answer) === msg) {
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

sendQuestion();

},

onChat: function (context) { const handler = activeSessions[context.event.threadID]; if (handler) handler(context); } };

  
