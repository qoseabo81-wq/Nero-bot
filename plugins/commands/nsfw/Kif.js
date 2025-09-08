module.exports = {
  config: {
    name: "كيف_تراني",
    aliases: ["كيفتراني", "askme"],
    version: "1.0",
    author: "عمر",
    countDown: 5,
    role: 0,
    shortDescription: "يسألك أسئلة أو يعطيك ردود صراحة عشوائية",
    longDescription: "البوت يرد عليك بكلام عشوائي عن جمالك أو شخصيتك",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, args }) {
    const tl = [
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

    const randomMsg = tl[Math.floor(Math.random() * tl.length)];
    return api.sendMessage(randomMsg, event.threadID, event.messageID);
  }
};
