export default {
  config: {
    name: "كيف_تراني",
    aliases: ["كيفتراني", "askme", "howseeme"],
    version: "1.0",
    author: "عمر",
    role: 0,
    shortDescription: "البوت يرد بردود عشوائية عن شكلك أو شخصيتك",
    longDescription: "أمر ترفيهي: يرسل ردود صراحة عشوائية لما تكتب كيف تراني",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
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

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    return api.sendMessage(randomMsg, event.threadID, event.messageID);
  }
};
