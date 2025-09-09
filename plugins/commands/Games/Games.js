import fs from "fs";
import axios from "axios";
import path from "path";

const cacheDir = path.resolve("./cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

const tempImageFilePath = path.join(cacheDir, "tempImage.jpg");

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
    const questions = [
      { image: "https://i.pinimg.com/originals/6f/a0/39/6fa0398e640e5545d94106c2c42d2ff8.jpg", answer: "العراق" },
      { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/256px-Flag_of_Brazil.svg.png", answer: "البرازيل" },
      { image: "https://i.pinimg.com/originals/66/38/a1/6638a104725f4fc592c1b832644182cc.jpg", answer: "فلسطين" },
      // ... أضف باقي الأسئلة كما هي
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const correctAnswer = randomQuestion.answer;

    // تحميل الصورة
    const imageResponse = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImageFilePath, Buffer.from(imageResponse.data, "binary"));

    const attachment = [fs.createReadStream(tempImageFilePath)];

    const info = await message.reply({ body: langData.ar_SY.question, attachment });

    // تخزين handleReply
    global.client.handleReply.push({
      name: config.name,
      messageID: info.messageID,
      correctAnswer
    });

  } catch (error) {
    console.error(error);
    await message.reply(`حدث خطأ: ${error.message}`);
  }
}

/** @type {TOnCallHandleReply} */
async function handleReply({ message, global, Currencies, handleReply }) {
  try {
    const userAnswer = message.body.trim().toLowerCase();
    const correctAnswer = handleReply.correctAnswer.toLowerCase();

    if (userAnswer === correctAnswer) {
      await Currencies.increaseMoney(message.senderID, 50);
      await message.reply(langData.ar_SY.correct);

      // محاولة حذف رسالة السؤال السابقة
      if (handleReply.messageID) {
        try { await global.client.unsendMessage(handleReply.messageID); } catch {}
      }
    } else {
      await message.reply(langData.ar_SY.wrong);
    }

    // حذف الصورة المؤقتة
    if (fs.existsSync(tempImageFilePath)) fs.unlinkSync(tempImageFilePath);

  } catch (error) {
    console.error(error);
    await message.reply(`حدث خطأ: ${error.message}`);
  }
}

export default {
  config,
  langData,
  onCall,
  handleReply
};
