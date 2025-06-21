const questions = [
  { question: "Quelle est la capitale de la France ?", answer: "paris" },
  { question: "Combien y a-t-il de continents sur Terre ?", answer: "7" },
  { question: "Qui a peint La Joconde ?", answer: "léonard de vinci" },
  { question: "Quelle est la plus grande planète du système solaire ?", answer: "jupiter" },
  { question: "Quelle est la monnaie du Japon ?", answer: "yen" },
  { question: "Combien de côtés a un hexagone ?", answer: "6" },
  { question: "En quelle année a eu lieu la Révolution française ?", answer: "1789" },
  { question: "Quel métal est utilisé pour fabriquer l’or ?", answer: "or" },
  { question: "Quel est l'organe principal du système circulatoire ?", answer: "coeur" },
  { question: "Combien font 7 x 8 ?", answer: "56" },
  { question: "Quel pays a gagné la Coupe du Monde 2018 ?", answer: "france" },
  { question: "Quelle est la capitale de l’Allemagne ?", answer: "berlin" },
  { question: "Combien de lettres dans l’alphabet français ?", answer: "26" },
  { question: "Quel est l'élément chimique H2O ?", answer: "eau" },
  { question: "Qui est le dieu du tonnerre dans la mythologie nordique ?", answer: "thor" },
  { question: "Quel animal est le roi de la savane ?", answer: "lion" },
  { question: "Combien de joueurs dans une équipe de football ?", answer: "11" },
  { question: "Quel est le plus grand océan du monde ?", answer: "pacifique" },
  { question: "Combien y a-t-il de jours dans une année bissextile ?", answer: "366" },
  { question: "Quelle est la langue la plus parlée au monde ?", answer: "mandarin" },
  { question: "Quel est le plus haut sommet du monde ?", answer: "everest" },
  { question: "Qui a écrit Roméo et Juliette ?", answer: "shakespeare" },
  { question: "Combien de couleurs dans l’arc-en-ciel ?", answer: "7" },
  { question: "Quel est le symbole chimique de l’oxygène ?", answer: "o" },
  { question: "Quelle planète est la plus proche du soleil ?", answer: "mercure" },
  { question: "Quelle est la capitale de la RDC ?", answer: "kinshasa" },
  { question: "Combien de zéros dans un milliard ?", answer: "9" },
  { question: "Quel pays a pour capitale Abuja ?", answer: "nigeria" },
  { question: "Quel est l’inventeur de la théorie de la relativité ?", answer: "einstein" },
  { question: "Quel est l’animal le plus rapide du monde ?", answer: "guépard" },
{ question: "Quel est le plus long fleuve du monde ?", answer: "nil" },
{ question: "Quelle est la capitale de l’Espagne ?", answer: "madrid" },
{ question: "Quel est le symbole chimique du fer ?", answer: "fe" },
{ question: "Combien d’heures dans une journée ?", answer: "24" },
{ question: "Quel est le pays d’origine du sushi ?", answer: "japon" },
{ question: "Quel est l’auteur de Harry Potter ?", answer: "jk rowling" },
{ question: "Dans quelle ville se trouve la Tour Eiffel ?", answer: "paris" },
{ question: "Quelle mer borde l’Égypte ?", answer: "mer rouge" },
{ question: "Quel est le sport national du Brésil ?", answer: "football" },
{ question: "Combien de joueurs au basketball ?", answer: "5" },
{ question: "Quel est l’instrument à cordes typique d’un orchestre ?", answer: "violon" },
{ question: "Combien de pattes une araignée possède-t-elle ?", answer: "8" },
{ question: "Dans quelle galaxie vivons-nous ?", answer: "voie lactée" },
{ question: "Quel est l’animal emblème de l’Australie ?", answer: "kangourou" },
{ question: "Combien de lunes possède la Terre ?", answer: "1" },
{ question: "Quelle est la capitale de l’Italie ?", answer: "rome" },
{ question: "Quel est le nom du président actuel de la RDC (2024) ?", answer: "félix tshisekedi" },
{ question: "Quel est le continent le plus peuplé ?", answer: "asie" },
{ question: "Comment s'appelle le gaz qu'on respire ?", answer: "oxygène" },
{ question: "Combien de mois dans une année ?", answer: "12" },
{ question: "Quel est le plus petit pays du monde ?", answer: "vatican" },
{ question: "Quelle langue parle-t-on au Brésil ?", answer: "portugais" },
{ question: "Combien de dents a un adulte normalement ?", answer: "32" },
{ question: "Combien de secondes dans une minute ?", answer: "60" },
{ question: "Qui a inventé l’ampoule électrique ?", answer: "edison" },
{ question: "Quelle est la première lettre de l’alphabet grec ?", answer: "alpha" },
{ question: "Quel pays a pour capitale Rabat ?", answer: "maroc" },
{ question: "Quel animal pond des œufs et allaite ?", answer: "ornithorynque" },
{ question: "Combien y a-t-il de couleurs primaires ?", answer: "3" },
{ question: "Quel est le métal précieux de couleur jaune ?", answer: "or" },
{ question: "Quel est le cri du chien ?", answer: "aboiement" },
{ question: "Quelle est la capitale du Canada ?", answer: "ottawa" },
{ question: "Dans quel pays se trouve le mont Kilimandjaro ?", answer: "tanzanie" },
{ question: "Quel est l'élément chimique du sel de table ?", answer: "sodium" },
{ question: "Quel est le plus grand désert du monde ?", answer: "antarctique" },
{ question: "Quel est le nom du satellite naturel de la Terre ?", answer: "lune" },
{ question: "Qui a écrit L’Iliade et l’Odyssée ?", answer: "homère" },
{ question: "Quelle est la capitale du Kenya ?", answer: "nairobi" },
{ question: "Quel fruit est jaune et courbé ?", answer: "banane" },
{ question: "Combien de doigts a un humain ?", answer: "10" },
{ question: "Qui est l’inventeur de Facebook ?", answer: "mark zuckerberg" },
{ question: "Quel est le plus grand pays du monde ?", answer: "russie" },
{ question: "Combien de jours en février pendant une année bissextile ?", answer: "29" },
{ question: "Quel est l’autre nom du Sahara ?", answer: "désert du sahara" },
{ question: "Quelle est la devise de la République Française ?", answer: "liberté égalité fraternité" },
{ question: "Quelle est la capitale de la Chine ?", answer: "pékin" },
{ question: "Quel animal a une mémoire légendaire ?", answer: "éléphant" },
{ question: "Quel est l’animal emblème de la Chine ?", answer: "panda" },
{ question: "Quel est le sport où on utilise une raquette et un volant ?", answer: "badminton" }
];

const activeSessions = {};

module.exports = {
  config: {
    name: "cg",
    role: "0",
    author: "Merdi Madimba or Bryan Bulakali",
    version: "1.0",
    description: "Quiz culture générale avec score",
    category: "🎮 Jeu"
  },

  onStart: async function ({ event, message, usersData }) {
    const threadID = event.threadID;

    if (activeSessions[threadID]) {
      return message.reply("❗ Un quiz est déjà en cours !");
    }

    // Sélectionner 10 questions aléatoires
    const selected = [...questions].sort(() => 0.5 - Math.random()).slice(0, 20);
    const scores = {};

    let currentIndex = 0;
    let currentQuestion = null;
    let timeoutID = null;
    let answered = false;

    const sendQuestion = async () => {
      if (currentIndex >= selected.length) {
        // Fin du quiz
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

      if (msg === currentQuestion.answer) {
        answered = true;
        clearTimeout(timeoutID);

        scores[senderName] = (scores[senderName] || 0) + 10;

        // Scoreboard
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
