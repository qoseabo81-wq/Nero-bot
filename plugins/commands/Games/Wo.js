const handleReply = [];

const config = {
  name: "مدينة",
  aliases: ["دول"],
  permissions: [0],
  description: "لعبة احزر العلم",
  usage: "",
  cooldown: 0,
  credits: "عمر",
  commandCategory: "العاب"
};

// قائمة الأسئلة
const questions = [
  { image: "https://i.pinimg.com/originals/6f/a0/39/6fa0398e640e5545d94106c2c42d2ff8.jpg", answer: "العراق" },
  { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/256px-Flag_of_Brazil.svg.png", answer: "البرازيل" },
  { image: "https://i.pinimg.com/originals/66/38/a1/6638a104725f4fc592c1b832644182cc.jpg", answer: "فلسطين" },
  { image: "https://i.pinimg.com/originals/f9/47/0e/f9470ea33ff6fbf794b0b8bb00a5ccb4.jpg", answer: "المغرب" },
  { image: "https://i.pinimg.com/originals/2d/a2/6e/2da26e58efd5f32fe2e33b9654907ab5.gif", answer: "الصومال" }
  // أضف بقية الأسئلة هنا...
];

/** تشغيل الأمر */
export async function onCall({ message, Currencies }) {
  try {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const correctAnswer = randomQuestion.answer.toLowerCase();

    // إرسال السؤال مباشرة مع رابط الصورة
    const sentMessage = await message.reply({
      body: "ما اسم علم هذه الدولة؟",
      attachment: [{ type: "image", url: randomQuestion.image }]
    });

    // تسجيل السؤال مع علامة لم يتم الإجابة عنه بعد
    handleReply.push({
      messageID: sentMessage.messageID,
      correctAnswer,
      answered: false
    });

  } catch (error) {
    console.error(error);
    message.reply("❌ حدث خطأ، حاول مرة أخرى.");
  }
}

/** معالجة الردود */
export async function onReply({ message, Currencies }) {
  try {
    const userAnswer = message.body.trim().toLowerCase();

    // العثور على السؤال غير المجاب عنه بعد
    const current = handleReply.find(x => !x.answered);
    if (!current) return; // تم الإجابة أو لا توجد أسئلة

    if (userAnswer === current.correctAnswer) {
      await Currencies.increaseMoney(message.senderID, 50);
      message.reply(`✅ تهانينا! إجابتك صحيحة، لقد حصلت على 50 دولار`);
      current.answered = true; // علامة على أن السؤال تم الإجابة عليه
    } else {
      message.reply("❌ إجابة خاطئة، حاول مرة أخرى");
    }

    // لا حاجة لحذف أي ملفات، كل شيء من الرابط مباشرة

  } catch (error) {
    console.error(error);
    message.reply("❌ حدث خطأ أثناء التحقق من الإجابة.");
  }
}

export default {
  config,
  onCall,
  onReply
};
