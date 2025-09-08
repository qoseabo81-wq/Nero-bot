module.exports = {
  config: {
    name: "كيف تراني",
    aliases: ["كيفتراني", "askme"],
    version: "1.0",
    author: "عمر",
    countDown: 5,
    role: 0,
    shortDescription: "البوت يعطيك ردود صراحة عشوائية",
    longDescription: "البوت يرد عليك بكلام عشوائي عن جمالك أو شخصيتك",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, args }) {
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
    
    return api.sendMessage(randomMsg, event.threadID);
  }
};
