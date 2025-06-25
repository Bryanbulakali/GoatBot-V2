// ============================= // 📚 Importations // ============================= const fs = require("fs"); const path = require("path");

// ============================= // 🔧 Normalisation texte // ============================= function normalize(text) { return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]/gi, "").trim(); }

// ============================= // 💾 Chargement des questions // ============================= const loadQuestions = (file, level) => { try { const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../data", file))); return data.filter(q => q.level === level); } catch (e) { return []; } };

const activeSessions = {}; // threadID: function

// ============================= // 🧠 Commande SQUIZS // ============================= module.exports = { config: { name: "squizs", role: 0, author: "Merdi Madimba & Bryan Bulakali", version: "1.0", description: "🎯 Quiz unifié : CG, Protagonistes & Drapeaux", category: "🎮 Jeu" },

onStart: async function ({ event, message }) { const threadID = event.threadID; activeSessions[threadID] = { step: 0 };

return message.send("🧠 Choisis ton type de quiz :\n1. Culture Générale\n2. Protagonistes de Mangas\n3. Drapeaux\n\nRéponds avec un chiffre.");

},

onChat: async function ({ event, message, usersData }) { const threadID = event.threadID; const senderID = event.senderID; const session = activeSessions[threadID]; if (!session) return;

const msg = event.body.trim();
const num = parseInt(msg);
if (isNaN(num)) return;

// Étape 0 : Choix type quiz
if (session.step === 0) {
  const types = ["cg.json", "protagonistes.json", "flag.json"];
  if (num < 1 || num > 3) return message.reply("❌ Choix invalide.");
  session.quizType = types[num - 1];
  session.step = 1;
  return message.send("📊 Choisis le niveau :\n1. Facile\n2. Moyen\n3. Difficile");
}

// Étape 1 : Choix niveau
if (session.step === 1) {
  const levels = ["easy", "medium", "hard"];
  if (num < 1 || num > 3) return message.reply("❌ Choix invalide.");
  session.level = levels[num - 1];
  session.step = 2;
  return message.send("📋 Combien de questions ?\n1. 10\n2. 20\n3. 30\n4. 40\n5. 50\n6. 60\n7. 70\n8. 80\n9. 90\n10. 100");
}

// Étape 2 : Choix nombre de questions et lancement du quiz
if (session.step === 2) {
  const options = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  if (num < 1 || num > 10) return message.reply("❌ Choix invalide.");

  const questions = loadQuestions(session.quizType, session.level);
  const nbQuestions = options[num - 1];

  if (questions.length < nbQuestions) {
    return message.reply(`❌ Pas assez de questions disponibles (${questions.length} trouvées).`);
  }

  const selected = [...questions].sort(() => Math.random() - 0.5).slice(0, nbQuestions);
  const scores = {};
  let index = 0;
  let currentQuestion = null;
  let timeoutID = null;
  let answered = false;

  const sendQuestion = async () => {
    if (index >= selected.length) {
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      let finalBoard = "🏁 Fin du quiz ! Résultat final :\n";
      for (let [name, pts] of sorted) {
        finalBoard += `🏅 ${name} : ${pts} pts\n`;
      }
      finalBoard += `\n👑 Vainqueur : ${sorted[0]?.[0] || "Aucun"}`;
      delete activeSessions[threadID];
      return await message.send(finalBoard);
    }

    answered = false;
    currentQuestion = selected[index];
    await message.send(`❓ Question ${index + 1} : ${currentQuestion.question}`);

    timeoutID = setTimeout(async () => {
      if (!answered) {
        await message.send(`⏰ Temps écoulé ! La bonne réponse était : ${currentQuestion.answer}`);
        index++;
        sendQuestion();
      }
    }, 10000);
  };

  activeSessions[threadID] = async ({ event, message }) => {
    if (!currentQuestion || answered) return;
    const msg = normalize(event.body);
    const senderName = await usersData.getName(event.senderID);

    if (msg === normalize(currentQuestion.answer)) {
      answered = true;
      clearTimeout(timeoutID);

      scores[senderName] = (scores[senderName] || 0) + 10;
      let board = "📊 Score actuel :\n";
      for (let [name, pts] of Object.entries(scores)) {
        board += `🏅 ${name} : ${pts} pts\n`;
      }

      await message.reply(`✅ Bonne réponse de ${senderName} !\n\n${board}`);
      index++;
      setTimeout(sendQuestion, 1000);
    }
  };

  session.step = null;
  sendQuestion();
}

} };

                    
