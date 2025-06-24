const questions = [
  { question: "uflyf", answer: "luffy" },
  { question: "ratonu", answer: "naruto" },
  { question: "kusesa", answer: "sasuke" },
  { question: "gkou", answer: "goku" },
  { question: "gociih", answer: "ichigo" },
  { question: "ojiarnt", answer: "tanjiro" },
  { question: "neukoz", answer: "nezuko" },
  { question: "dedwra", answer: "edward" },
  { question: "kaakshi", answer: "kakashi" },
  { question: "aamtisa", answer: "saitama" },
  { question: "nere", answer: "eren" },
  { question: "dkue", answer: "deku" },
  { question: "akamim", answer: "makima" },
  { question: "akuri", answer: "iruka" },
  { question: "lgiht", answer: "light" },
  { question: "adinbs", answer: "sinbad" },
  { question: "uraok", answer: "kaoru" },
  { question: "taas", answer: "asta" },
  { question: "guok", answer: "goku" },
  { question: "ujiy", answer: "yuji" },
  { question: "nekaki", answer: "kaneki" },
  { question: "huoram", answer: "mahuro" },
  { question: "kairoto", answer: "rokaito" },
  { question: "nraia", answer: "arina" },
  { question: "rukia", answer: "kirua" },
  { question: "nog", answer: "gon" },
  { question: "obm", answer: "mob" },
  { question: "irtoik", answer: "kirito" },
  { question: "iramn", answer: "marin" },
  { question: "araul", answer: "laura" }
];

function normalize(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

const activeSessions = {};

module.exports = {
  config: {
    name: "anagramme",
    aliases: ["ang"],
    role: "0",
    author: "Merdi Madimba or Bryan Bulakali",
    version: "1.1",
    description: "Quiz avec des anagrammes de personnages de mangas",
    category: "🎮 Jeu"
  },

  onStart: async function ({ event, message, usersData }) {
    const threadID = event.threadID;
    const authorID = event.senderID;

    if (activeSessions[threadID]) {
      return message.reply("❗ Un quiz est déjà en cours !");
    }

    const shuffled = [...questions].sort(() => Math.random() - 0.5); // 100% aléatoire
    const scores = {};
    let currentIndex = 0;
    let currentQuestion = null;
    let timeoutID = null;
    let answered = false;

    const sendQuestion = async () => {
      if (currentIndex >= shuffled.length) return finishQuiz();

      answered = false;
      currentQuestion = shuffled[currentIndex];

      await message.send({
        body: `🔀 Anagramme ${currentIndex + 1} : Qui est-ce ? ➤ ${currentQuestion.question}`,
        buttons: [{ type: "reply", reply: { id: "stop_quiz", title: "⛔ Stop Quiz" } }]
      });

      timeoutID = setTimeout(async () => {
        if (!answered) {
          await message.send(`⏰ Temps écoulé ! La bonne réponse était : ${currentQuestion.answer}`);
          currentIndex++;
          sendQuestion();
        }
      }, 10000);
    };

    const finishQuiz = async () => {
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      let finalBoard = "🏁 Fin du quiz ! Résultat final :\n";
      let winner = sorted[0]?.[0] || "Aucun";

      for (let [name, pts] of sorted) {
        finalBoard += `🏅 ${name} : ${pts} pts\n`;
      }

      finalBoard += `👑 Vainqueur : ${winner}`;
      await message.send(finalBoard);
      delete activeSessions[threadID];
    };

    activeSessions[threadID] = async ({ event, message }) => {
      if (event.type === "message") {
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
          currentIndex++;
          setTimeout(sendQuestion, 1000);
        }
      }

      if (event.type === "message_reply" && event.messageReply?.replyID === "stop_quiz") {
        if (event.senderID === authorID) {
          clearTimeout(timeoutID);
          await message.send("🛑 Quiz arrêté manuellement.");
          delete activeSessions[threadID];
        } else {
          await message.reply("🚫 Seul l'organisateur du quiz peut arrêter la partie.");
        }
      }
    };

    sendQuestion();
  },

  onChat: function (context) {
    const handler = activeSessions[context.event.threadID];
    if (handler) handler(context);
  }
};
