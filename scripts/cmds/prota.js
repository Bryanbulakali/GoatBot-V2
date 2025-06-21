const questions = [
  { question: "Quel est le héros principal de One Piece ?", answer: "Luffy", level: "easy" },
  { question: "Quel est le nom du ninja blond de Konoha ?", answer: "Naruto", level: "easy" },
  { question: "Qui possède le Death Note ?", answer: "Light", level: "easy" },
  { question: "Quel est le héros dans Bleach ?", answer: "Ichigo", level: "easy" },
  { question: "Comment s'appelle le héros de My Hero Academia ?", answer: "Deku", level: "easy" },
  { question: "Qui est le frère adoptif de Sasuke ?", answer: "Itachi", level: "easy" },
  { question: "Qui est le roi des démons dans Nanatsu no Taizai ?", answer: "Meliodas", level: "easy" },
  { question: "Qui est le chasseur de démons au kimono à motif hanafuda ?", answer: "Tanjiro", level: "easy" },
  { question: "Quel est le prénom du héros dans Dragon Ball ?", answer: "Goku", level: "easy" },
  { question: "Qui est l'alchimiste d'acier ?", answer: "Edward", level: "easy" },
  { question: "Dans Tokyo Ghoul, qui devient un demi-goule ?", answer: "Kaneki", level: "easy" },
  { question: "Comment s'appelle le pirate au chapeau de paille ?", answer: "Luffy", level: "easy" },
  { question: "Quel personnage veut devenir Hokage ?", answer: "Naruto", level: "easy" },
  { question: "Qui est le rival de Goku ?", answer: "Vegeta", level: "easy" },
  { question: "Dans Hunter x Hunter, qui est le protagoniste principal ?", answer: "Gon", level: "easy" },
  { question: "Quel héros possède une force surhumaine dans One Punch Man ?", answer: "Saitama", level: "easy" },
  { question: "Qui est la sœur de Tanjiro ?", answer: "Nezuko", level: "easy" },
  { question: "Dans Fairy Tail, qui utilise la magie du feu du dragon ?", answer: "Natsu", level: "easy" },
  { question: "Quel personnage principal est détective dans Detective Conan ?", answer: "Conan", level: "easy" },
  { question: "Qui est le roi des pirates dans One Piece ?", answer: "Luffy", level: "easy" },
  { question: "Dans Jujutsu Kaisen, qui avale un doigt maudit ?", answer: "Yuji", level: "easy" },
  { question: "Quel est le vrai nom de Kira dans Death Note ?", answer: "Light", level: "easy" },
  { question: "Dans Black Clover, qui ne possède pas de magie ?", answer: "Asta", level: "easy" },
  { question: "Qui veut devenir le roi sorcier ?", answer: "Asta", level: "easy" },
  { question: "Quel héros utilise le Gear Fourth ?", answer: "Luffy", level: "easy" },
  { question: "Quel est le prénom de Midoriya ?", answer: "Izuku", level: "easy" },
  { question: "Qui est le principal antagoniste de Naruto ?", answer: "Madara", level: "easy" },
  { question: "Quel est le frère d’Edward Elric ?", answer: "Alphonse", level: "easy" },
  { question: "Quel personnage a un œil de ghoul ?", answer: "Kaneki", level: "easy" },
  { question: "Dans SAO, qui est le héros ?", answer: "Kirito", level: "easy" },
  { question: "Quel est le rêve de Naruto ?", answer: "Hokage", level: "easy" },
  { question: "Quel héros vit dans l'univers des titans ?", answer: "Eren", level: "easy" },
  { question: "Quel est le prénom de l'héroïne dans The Promised Neverland ?", answer: "Emma", level: "easy" },
  { question: "Qui est le capitaine de l'équipage du chapeau de paille ?", answer: "Luffy", level: "easy" },
  { question: "Quel héros porte une cape blanche dans One Punch Man ?", answer: "Saitama", level: "easy" },
  { question: "Dans Mob Psycho 100, comment s'appelle le héros ?", answer: "Mob", level: "easy" },
  { question: "Dans Blue Exorcist, qui est le fils de Satan ?", answer: "Rin", level: "easy" },
  { question: "Quel héros a un bras mécanique dans Fullmetal Alchemist ?", answer: "Edward", level: "easy" },
  { question: "Qui est le meilleur ami de Gon ?", answer: "Killua", level: "easy" },
  { question: "Quel est le nom du détective dans Death Note ?", answer: "L", level: "easy" },
  { question: "Dans Naruto, qui est le professeur de l'équipe 7 ?", answer: "Kakashi", level: "easy" },
  { question: "Quel personnage veut venger son clan dans Naruto ?", answer: "Sasuke", level: "easy" },
  { question: "Qui est le mentor de Deku ?", answer: "All Might", level: "easy" },
  { question: "Quel est le prénom du Titan Assaillant ?", answer: "Eren", level: "easy" },
  { question: "Qui est le fondateur du clan Uchiha ?", answer: "Madara", level: "easy" },
  { question: "Quel héros se bat contre Muzan dans Demon Slayer ?", answer: "Tanjiro", level: "easy" },
  { question: "Quel est le nom complet de Luffy ?", answer: "Monkey D. Luffy", level: "easy" },
  { question: "Qui est le chef de l'équipe Fairy Tail ?", answer: "Makarov", level: "easy" },
  { question: "Quel est le nom de famille de Naruto ?", answer: "Uzumaki", level: "easy" }
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
    name: "prota",
    role: "0",
    author: "Merdi Madimba or Bryan Bulakali",
    version: "1.0",
    description: "Quiz culture manga avec score",
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
