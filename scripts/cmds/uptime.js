const os = require("os");
const { exec } = require("child_process");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt"],
    version: "2.0",
    author: "Bryan Bulakali",
    countDown: 5,
    role: 2, // Seul l’administrateur du bot peut l'utiliser
    shortDescription: "📊 Statut complet du bot",
    longDescription: "Affiche les infos système : uptime, RAM, CPU, disque...",
    category: "🛠️ Système",
    guide: {
      fr: "{p}uptime"
    }
  },

  onStart: async function ({ message }) {
    const uptimeSec = process.uptime();
    const uptime = convertSeconds(uptimeSec);

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const cpuModel = os.cpus()[0]?.model || "Non disponible";
    const load = os.loadavg().map(l => l.toFixed(2)).join(" | ");
    const cores = os.cpus().length;

    const platform = os.platform();
    const arch = os.arch();
    const nodeVer = process.version;

    // Lecture du disque avec la commande 'df -h' (Linux uniquement)
    exec("df -h /", (err, stdout, stderr) => {
      let diskInfo = "❌ Impossible de lire l’espace disque.";

      if (!err) {
        const lines = stdout.trim().split("\n");
        if (lines.length >= 2) {
          const parts = lines[1].split(/\s+/);
          diskInfo =
`🖴 **Espace disque**
📦 Total : ${parts[1]}
📈 Utilisé : ${parts[2]}
📉 Libre : ${parts[3]}
🔢 Pourcentage : ${parts[4]}`;
        }
      }

      const formatMB = bytes => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

      const reply =
`📟 **𝗦𝗧𝗔𝗧𝗨𝗧 𝗗𝗨 𝗕𝗢𝗧**

🕒 **Uptime :** ${uptime}
💻 **CPU :** ${cpuModel}
🔢 **Cœurs :** ${cores}
⚙️ **Load avg (1/5/15 min) :** ${load}
📊 **RAM totale :** ${formatMB(totalMem)}
📈 **RAM utilisée :** ${formatMB(usedMem)}
📉 **RAM libre :** ${formatMB(freeMem)}

🧰 **Système :** ${platform} ${arch}
🧪 **Node.js :** ${nodeVer}

${diskInfo}

👑 **Auteur : Bryan Bulakali**`;

      message.reply(reply);
    });
  }
};

function convertSeconds(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}j ${h}h ${m}m ${s}s`;
  }
