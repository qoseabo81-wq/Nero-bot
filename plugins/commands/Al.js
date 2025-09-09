const config = {
  name: "Al",
  aliases: ["askme", "كيفتراني"],
  permissions: [0],
  description: "البوت يرد عليك برد عشوائي عن جمالك أو شخصيتك",
  usage: "",
  cooldown: 3,
  credits: "عمر"
};

async function onCall({ message }) {
  const replies = [
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

  const randomReply = replies[Math.floor(Math.random() * replies.length)];
  return message.reply(randomReply);
}

export default {
  config,
  onCall
};
