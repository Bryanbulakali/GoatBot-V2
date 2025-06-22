const questions = [
  { question: "🇫🇷", answer: "france" },
  { question: "🇯🇵", answer: "japon" },
  { question: "🇨🇩", answer: "rdc" },
  { question: "🇧🇪", answer: "belgique" },
  { question: "🇩🇪", answer: "allemagne" },
  { question: "🇺🇸", answer: "états-unis" },
  { question: "🇨🇳", answer: "chine" },
  { question: "🇧🇷", answer: "brésil" },
  { question: "🇰🇪", answer: "kenya" },
  { question: "🇨🇦", answer: "canada" },
  { question: "🇮🇳", answer: "inde" },
  { question: "🇷🇺", answer: "russie" },
  { question: "🇲🇦", answer: "maroc" },
  { question: "🇿🇦", answer: "afrique du sud" },
  { question: "🇮🇹", answer: "italie" },
  { question: "🇪🇸", answer: "espagne" },
  { question: "🇲🇽", answer: "mexique" },
  { question: "🇦🇷", answer: "argentine" },
  { question: "🇵🇹", answer: "portugal" },
  { question: "🇸🇳", answer: "sénégal" },
  { question: "🇳🇬", answer: "nigeria" },
  { question: "🇹🇳", answer: "tunisie" },
  { question: "🇹🇷", answer: "turquie" },
  { question: "🇬🇧", answer: "royaume-uni" },
  { question: "🇦🇺", answer: "australie" },
  { question: "🇰🇷", answer: "corée du sud" },
  { question: "🇸🇪", answer: "suède" },
  { question: "🇳🇴", answer: "norvège" },
  { question: "🇫🇮", answer: "finlande" },
  { question: "🇨🇭", answer: "suisse" },
  { question: "🇦🇹", answer: "autriche" },
  { question: "🇳🇱", answer: "pays-bas" },
  { question: "🇩🇰", answer: "danemark" },
  { question: "🇬🇷", answer: "grèce" },
  { question: "🇪🇬", answer: "egypte" },
  { question: "🇮🇱", answer: "israël" },
  { question: "🇮🇶", answer: "irak" },
  { question: "🇮🇷", answer: "iran" },
  { question: "🇸🇦", answer: "arabie saoudite" },
  { question: "🇦🇪", answer: "emirats arabes unis" },
  { question: "🇶🇦", answer: "qatar" },
  { question: "🇵🇰", answer: "pakistan" },
  { question: "🇧🇩", answer: "bangladesh" },
  { question: "🇻🇳", answer: "vietnam" },
  { question: "🇹🇭", answer: "thaïlande" },
  { question: "🇲🇾", answer: "malaisie" },
  { question: "🇵🇭", answer: "philippines" },
  { question: "🇸🇬", answer: "singapour" },
  { question: "🇵🇪", answer: "pérou" },
  { question: "🇨🇴", answer: "colombie" }
];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .trim();
}

const activeSessions = {};

module.exports = {
  config: {
    name: "flag",
    role: "0",
    author: "Merdi Madimba or Bryan Bulakali",
    version: "1.1",
    description: "Quiz drapeaux avec score",
    category: "🎮 Jeu"
  },

  onStart: async function ({ event, message, usersData }) {
    const threadID = event.threadID;

    if (activeSessions[threadID]) {
      return message.reply("❗ Un quiz est déjà en cours !");
    }

    const selected = [...questions].sort(() => 0.5 - Math.random()).slice(0, 20);
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

        finalBoard += `👑 Vainqueur : ${winner}`;
        await message.send(finalBoard);
        delete activeSessions[threadID];
        return;
      }

      answered = false;
      currentQuestion = selected[currentIndex];

      await message.send(`🧠 Question ${currentIndex + 1} : Quel est ce drapeau ? ${currentQuestion.question}`);

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
