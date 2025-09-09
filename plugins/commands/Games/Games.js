import fs from "fs";
import path from "path";
import axios from "axios";

const cacheDir = path.join(process.cwd(), "cache"); 
const tempImageFilePath = path.join(cacheDir, "tempImage.jpg");

// إنشاء المجلد إذا لم يكن موجودًا
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
  console.log("تم إنشاء مجلد cache بنجاح ✅");
}

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
      { image: "https://i.pinimg.com/originals/f9/47/0e/f9470ea33ff6fbf794b0b8bb00a5ccb4.jpg", answer: "المغرب" },
      { image: "https://i.pinimg.com/originals/2d/a2/6e/2da26e58efd5f32fe2e33b9654907ab5.gif", answer: "الصومال" },
      { image: "https://i.pinimg.com/originals/0e/10/d2/0e10d2240dd28af2eff27ce0fa8b5b8d.jpg", answer: "اليابان" },
      { image: "https://i.pinimg.com/originals/e8/8e/e7/e88ee7f3ba7ff9181aabdd9520bdfa64.jpg", answer: "الجزائر" },
      { image: "https://i.pinimg.com/564x/21/47/ba/2147ba2a3780fb5b9395af5a0eb30deb.jpg", answer: "سوريا" },
      // أضف بقية الأسئلة هنا بنفس الشكل...
    ];

    // اختيار سؤال عشوائي
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const correctAnswer = randomQuestion.answer;

    // جلب الصورة وحفظها مؤقتًا
    const response = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImageFilePath, Buffer.from(response.data, "binary"));

    // إرسال الصورة مع السؤال
    await message.reply({
      body: langData.ar_SY.question,
      attachment: [fs.createReadStream(tempImageFilePath)]
    });

    // تسجيل handleReply لمعالجة الإجابة
    if (!global.client.handleReply) global.client.handleReply = [];
    global.client.handleReply.push({
      name: config.name,
      messageID: message.messageID,
      correctAnswer: correctAnswer
    });

  } catch (error) {
    console.error(error);
    message.reply(`حدث خطأ: ${error.message}`);
  }
}

export default {
  config,
  langData,
  onCall
};
