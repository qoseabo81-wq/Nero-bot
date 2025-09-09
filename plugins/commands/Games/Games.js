import fs from "fs";
import axios from "axios";

const config = {
  name: "اعلام",
  aliases: ["اعلام"],
  permissions: [0],
  description: "لعبة احزر العلم",
  usage: "",
  cooldown: 0,
  credits: "عمر",
  commandCategory: "العاب"
};

const langData = {
  ar_SY: {
    correct: "✅ إجابة صحيحة! لقد حصلت على 50 دولار 💵",
    wrong: "❌ إجابة خاطئة، حاول مرة أخرى",
    question: "ما اسم علم هذه الدولة؟"
  }
};

/** @type {TOnCallCommand} */
async function onCall({ message, global, Currencies }) {
  try {
    // إنشاء مجلد cache إذا لم يكن موجود
    if (!fs.existsSync("./cache")) fs.mkdirSync("./cache");

    // قائمة الأسئلة مع الصور
    const questions = [
      { image: "https://i.pinimg.com/originals/6f/a0/39/6fa0398e640e5545d94106c2c42d2ff8.jpg", answer: "العراق" },
      { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/256px-Flag_of_Brazil.svg.png", answer: "البرازيل" },
      { image: "https://i.pinimg.com/originals/66/38/a1/6638a104725f4fc592c1b832644182cc.jpg", answer: "فلسطين" },
      { image: "https://i.pinimg.com/originals/f9/47/0e/f9470ea33ff6fbf794b0b8bb00a5ccb4.jpg", answer: "المغرب" },
      { image: "https://i.pinimg.com/originals/2d/a2/6e/2da26e58efd5f32fe2e33b9654907ab5.gif", answer: "الصومال" }
      // يمكنك إضافة باقي الدول هنا
    ];

    // اختيار سؤال عشوائي
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    // تحميل الصورة مؤقتًا
    const tempImagePath = "./cache/tempImage.jpg";
    const response = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImagePath, Buffer.from(response.data, "binary"));

    // إرسال السؤال مع الصورة
    const sentMessage = await message.reply({
      body: langData.ar_SY.question,
      attachment: fs.createReadStream(tempImagePath)
    });

    // تسجيل handleReply للإجابة
    global.client.handleReply.push({
      name: config.name,
      messageID: sentMessage.messageID,
      author: message.senderID,
      correctAnswer: randomQuestion.answer
    });
  } catch (err) {
    console.error(err);
    return message.reply(`حدث خطأ: ${err.message}`);
  }
}

/** @type {TOnReplyCommand} */
async function handleReply({ message, event, global, Currencies, handleReply }) {
  try {
    if (event.senderID !== handleReply.author) return;

    const userAnswer = event.body.trim().toLowerCase();
    const correctAnswer = handleReply.correctAnswer.toLowerCase();

    if (userAnswer === correctAnswer) {
      await Currencies.increaseMoney(event.senderID, 50);
      message.reply(langData.ar_SY.correct);
    } else {
      message.reply(langData.ar_SY.wrong);
    }
  } catch (err) {
    console.error(err);
    return message.reply(`حدث خطأ: ${err.message}`);
  }
}

export default {
  config,
  langData,
  onCall,
  handleReply
};
