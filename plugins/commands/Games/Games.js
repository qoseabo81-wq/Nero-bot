import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

// حل مشكلة المسارات مع ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// المسار المطلق للملف المؤقت
const tempImageFilePath = path.join(__dirname, "../../cache/tempImage.jpg");

// تأكد من وجود مجلد cache
const cacheDir = path.dirname(tempImageFilePath);
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

// مصفوفة لتخزين الرسائل المعلقة مؤقتًا
let handleReply = [];

const config = {
  name: "دول",
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
async function onCall({ message, Currencies }) {
  try {
    const questions = [
      { image: "https://i.pinimg.com/originals/6f/a0/39/6fa0398e640e5545d94106c2c42d2ff8.jpg", answer: "العراق" },
      { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/256px-Flag_of_Brazil.svg.png", answer: "البرازيل" },
      { image: "https://i.pinimg.com/originals/66/38/a1/6638a104725f4fc592c1b832644182cc.jpg", answer: "فلسطين" },
      { image: "https://i.pinimg.com/originals/f9/47/0e/f9470ea33ff6fbf794b0b8bb00a5ccb4.jpg", answer: "المغرب" },
      { image: "https://i.pinimg.com/originals/2d/a2/6e/2da26e58efd5f32fe2e33b9654907ab5.gif", answer: "الصومال" }
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const correctAnswer = randomQuestion.answer.toLowerCase();

    // تنزيل الصورة مؤقتًا
    const imageResponse = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImageFilePath, Buffer.from(imageResponse.data, "binary"));

    // إرسال السؤال
    const sentMessage = await message.reply({
      body: langData.ar_SY.question,
      attachment: [fs.createReadStream(tempImageFilePath)]
    });

    // تسجيل الرسالة في handleReply
    handleReply.push({
      messageID: sentMessage.messageID,
      author: message.senderID,
      correctAnswer
    });

    // حذف الصورة بعد الإرسال
    setTimeout(() => {
      if (fs.existsSync(tempImageFilePath)) fs.unlinkSync(tempImageFilePath);
    }, 5000);

  } catch (error) {
    console.error(error);
    message.reply("❌ حدث خطأ، حاول مرة أخرى.");
  }
}

/** @type {TOnReplyCommand} */
async function onReply({ message, Currencies }) {
  try {
    const userAnswer = message.body.trim().toLowerCase();

    // البحث عن الرسالة في handleReply
    const index = handleReply.findIndex(x => x.author === message.senderID);
    if (index === -1) return; // لا توجد رسالة معلقة لهذا المستخدم

    const currentReply = handleReply[index];

    if (userAnswer === currentReply.correctAnswer) {
      await Currencies.increaseMoney(message.senderID, 50);
      message.reply(langData.ar_SY.correct);
    } else {
      message.reply(langData.ar_SY.wrong);
    }

    // إزالة الرسالة بعد الرد
    handleReply.splice(index, 1);

  } catch (error) {
    console.error(error);
    message.reply("❌ حدث خطأ أثناء التحقق من الإجابة.");
  }
}

export default {
  config,
  langData,
  onCall,
  onReply
};
