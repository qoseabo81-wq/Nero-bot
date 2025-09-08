module.exports = (function() {
  const messages = [
    "ايش هذا القبح",
    "مثل الركبة",
    "حاول تعتني بشكلك",
    "جمالك يهد جبال",
    "وسيم",
    "مجنن البنات",
    "ابتسامتك سر جمالك",
    "قمر يشوفك البنات يحبوك",
    "صراحة بدي اصير حبيبتك",
    "إنت كابوس مو حلم",
    "إنت إعلان تحذيري متحرك",
    "وجودك يقلل نسبة الجمال بالعالم",
    "إنت وردة بين أشواك",
    "كل ما أشوفك بقول سبحان الخالق",
    "انت أجمل مما تتصور",
    "الله يبارك بجمالك وروحك",
    "انت شخص بيسوى الدنيا",
    "ضحكتك تساوي ألف وردة",
    "انت أروع مما ينكتب بالكلام"
  ];

  function pick() {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  async function sendRandom(api, event) {
    if (!event) return;
    const threadID = event.threadID || (event.message && event.message.threadID) || event.senderID;
    const messageID = event.messageID || (event.message && event.message.messageID);
    if (!threadID) return;
    const text = pick();
    try {
      if (typeof api.sendMessage === 'function') {
        return api.sendMessage(text, threadID, (typeof messageID !== "undefined") ? messageID : undefined);
      } else if (typeof api.send === 'function') {
        return api.send({ body: text }, threadID);
      } else {
        console.log('لم أجد دالة مناسبة للإرسال على api');
      }
    } catch (e) {
      console.error('sendRandom error:', e);
    }
  }

  console.log('Module كيف_تراني (howseeme) loaded');

  return {
    config: {
      name: "كيف_تراني",
      aliases: ["كيفتراني", "askme", "howseeme"],
      version: "1.2",
      author: "عمر",
      countDown: 1,
      role: 0,
      shortDescription: "ردود عشوائية عن كيف تراه",
      category: "fun",
      guide: "{pn}"
    },

    // handlers متعدّدة علشان تزيد فرص التوافق مع النسخ المختلفة
    onStart: async function ({ api, event, args }) { return sendRandom(api, event); },
    run: async function ({ api, event, args }) { return sendRandom(api, event); },
    onChat: async function ({ api, event, args }) { return sendRandom(api, event); },
    onMessage: async function ({ api, event, args }) { return sendRandom(api, event); },

    // نسخة تستمع للنصوص (مثل: المستخدم كتب "askme" من دون بادئة)
    handleEvent: async function ({ api, event }) {
      try {
        if (!event.body) return;
        const body = event.body.toString().toLowerCase();
        if (body.includes('askme') || body.includes('كيفتراني') || body.includes('كيف_تراني') || body.includes('howseeme')) {
          return sendRandom(api, event);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
})();
