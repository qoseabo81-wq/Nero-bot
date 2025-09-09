import fs from "fs";
import axios from "axios";
import path from "path";

// تأكد من وجود مجلد cache
const cacheDir = path.resolve("./cache");
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

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
      // أضف بقية الأسئلة هنا كما في قائمتك
    ];

    // اختيار سؤال عشوائي
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const correctAnswer = randomQuestion.answer;

    // تحميل الصورة
    const response = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImageFilePath, Buffer.from(response.data, "binary"));

    // إرسال السؤال مع الصورة
    const attachment = [fs.createReadStream(tempImageFilePath)];
    await message.reply({ body: langData.ar_SY.question, attachment });

    // انتظار الرد (يمكنك إضافة handleReply أو أي طريقة تحقق حسب بوتك)
    global.client.handleReply.push({
      name: config.name,
      messageID: message.messageID,
      correctAnswer
    });

  } catch (error) {
    console.error(error);
    await message.reply(`حدث خطأ: ${error.message}`);
  }
}

export default {
  config,
  langData,
  onCall
};
