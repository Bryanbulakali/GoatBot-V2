// ============================
// 🧠 Questions du Quiz
// ============================

const questions = [
  { question: "Jojo no kimyou no bouken diamond is unbreakable", answer: "Josuke", level: "easy" },
  { question: "Fairy tail", answer: "Natsu", level: "easy" },
  { question: "Jojo's bizarre adventure golden wind", answer: "Giorno", level: "easy" },
  { question: "Vinland Saga", answer: "Thorfinn", level: "easy" },
  { question: "Boruto two blue vortex", answer: "Boruto", level: "easy" },
  { question: "Boruto : Naruto next générations", answer: "Boruto", level: "easy" },
  { question: "Solo Leveling", answer: "Jinwoo", level: "easy" },
  { question: "Chicano Kei", answer: "Kei", level: "easy" },
  { question: "Pokemon ligue indigo", answer: "Sasha", level: "easy" },
  { question: "Fullmetal Alchemist", answer: "Edward", level: "easy" },
  { question: "Fire Force", answer: "Shinra", level: "easy" },
  { question: "Food Wars", answer: "Soma", level: "easy" },
  { question: "Bleach Thousand Year Blood War", answer: "Ichigo", level: "easy" },
  { question: "Hunter X Hunter", answer: "Gon", level: "easy" },
  { question: "Dr Stone", answer: "Senku", level: "easy" },
  { question: "The Seven Deadly Sins", answer: "Meliodas", level: "easy" },
  { question: "Assassination Classroom", answer: "Nagisa", level: "easy" },
  { question: "Blue Lock", answer: "Isagi", level: "easy" },
  { question: "Détective Conan", answer: "Conan", level: "easy" },
  { question: "Jujutsu Kaisen 0", answer: "Yuta", level: "easy" },
  { question: "Jujutsu Kaisen", answer: "Yuji", level: "easy" },
  { question: "Death Note", answer: "Light", level: "easy" },
  { question: "Classroom of the Elite", answer: "Kiyotaka", level: "easy" },
  { question: "Black Clover", answer: "Asta", level: "easy" },
  { question: "Shangri-La Frontier", answer: "Sunraku", level: "easy" },
  { question: "Kengan Ashura", answer: "Ohma", level: "easy" },
  { question: "Bleach", answer: "Ichigo", level: "easy" },
  { question: "Tomodachi Game", answer: "Yuichi", level: "easy" },
  { question: "Tokyo Ghoul", answer: "Ken", level: "easy" },
  { question: "Sword Art Online", answer: "Kirito", level: "easy" },
  { question: "Naruto", answer: "Naruto", level: "easy" },
  { question: "Captain Tsubasa", answer: "Tsubasa", level: "easy" },
  { question: "The Promised Neverland", answer: "Emma", level: "easy" },
  { question: "One Piece", answer: "Luffy", level: "easy" },
  { question: "One Punch Man", answer: "Saitama", level: "easy" },
  { question: "Kingdom", answer: "Shin", level: "easy" },
  { question: "Blue Exorcist", answer: "Rin", level: "easy" },
  { question: "Fullmetal Alchemist Brotherhood", answer: "Edward", level: "easy" },
  { question: "Sakamoto Days", answer: "Sakamoto", level: "easy" },
  { question: "Bungo Stray Dogs", answer: "Atsushi", level: "easy" },
  { question: "Mob Psycho 100", answer: "Shigeo", level: "easy" },
  { question: "No Game No Life", answer: "Shiro et Sora", level: "easy" },
  { question: "Hell's Paradise", answer: "Gabimaru", level: "easy" },
  { question: "Attack on Titan", answer: "Eren", level: "easy" },
  { question: "Hellsing", answer: "Alucard", level: "easy" },
  { question: "Demon Slayer", answer: "Tanjiro", level: "easy" },
  { question: "My Hero Academia", answer: "Deku", level: "easy" },
  { question: "Baki Hanma", answer: "Baki", level: "easy" },
  { question: "The Rising of the Shield Hero", answer: "Naofumi", level: "easy" }
];

// ============================
// 🔧 Fonction de normalisation
// ============================

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .trim();
}

// ============================
// 🧠 Sessions actives du quiz
// ============================

const activeSessions = {};

// ============================
// 🧩 Commande GoatBot
// ============================

module.exports = {
  config: {
    name: "prota",
    role: 0,
    author: "Merdi Madimba & Bryan Bulakali",
    version: "1.0",
    description: "🎮 Quiz culture manga avec score",
    category: "🎮 Jeu"
  },

  onStart: async function ({ event, message, usersData }) {
    const threadID = event.threadID;

    if (activeSessions[threadID]) {
      return message.reply("❗ Un quiz est déjà en cours dans cette conversation !");
    }

    const selected = [...questions].sort(() => Math.random() - 0.5).slice(0, 20);
    const scores = {};
    let currentIndex = 0;
    let currentQuestion = null;
    let timeoutID = null;
    let answered = false;

    const sendQuestion = async () => {
      if (currentIndex >= selected.length) {
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        let finalBoard = "🏁 Fin du quiz ! Résultat final :\n";
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
      const msg = event.body?.toLowerCase().trim();

      if (normalize(msg) === normalize(currentQuestion.answer)) {
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

  onChat: function (context) {
    const handler = activeSessions[context.event.threadID];
    if (handler) handler(context);
  }
};
