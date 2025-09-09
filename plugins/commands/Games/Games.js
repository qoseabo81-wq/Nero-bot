import fs from "fs";
import path from "path";
import axios from "axios";

const cacheDir = path.resolve("./cache");
const tempImageFilePath = path.join(cacheDir, "tempImage.jpg");

// تأكد من وجود مجلد cache
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
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
    // قائمة كاملة بالأسئلة مع الصور
    const questions = [
      { image: "https://i.pinimg.com/originals/6f/a0/39/6fa0398e640e5545d94106c2c42d2ff8.jpg", answer: "العراق" },
      { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/256px-Flag_of_Brazil.svg.png", answer: "البرازيل" },
      { image: "https://i.pinimg.com/originals/66/38/a1/6638a104725f4fc592c1b832644182cc.jpg", answer: "فلسطين" },
      { image: "https://i.pinimg.com/originals/f9/47/0e/f9470ea33ff6fbf794b0b8bb00a5ccb4.jpg", answer: "المغرب" },
      { image: "https://i.pinimg.com/originals/2d/a2/6e/2da26e58efd5f32fe2e33b9654907ab5.gif", answer: "الصومال" },
      { image: "https://i.pinimg.com/originals/0e/10/d2/0e10d2240dd28af2eff27ce0fa8b5b8d.jpg", answer: "اليابان" },
      { image: "https://i.pinimg.com/originals/e8/8e/e7/e88ee7f3ba7ff9181aabdd9520bdfa64.jpg", answer: "الجزائر" },
      { image: "https://i.pinimg.com/564x/21/47/ba/2147ba2a3780fb5b9395af5a0eb30deb.jpg", answer: "سوريا" },
      { image: "https://i.pinimg.com/564x/a9/e9/c3/a9e9c3a54aa9fbe2400cc85c8dc45dc3.jpg", answer: "ليبيا" },
      { image: "https://i.pinimg.com/564x/72/d7/d9/72d7d9586177d3cd05adbd0d9f494b20.jpg", answer: "السعودية" },
      { image: "https://i.pinimg.com/564x/e1/2d/13/e12d13ee06067dc324086ac1cf699a4f.jpg", answer: "تونس" },
      { image: "https://i.pinimg.com/564x/03/d1/24/03d1245ce41669d15ab285c31e1b2b4c.jpg", answer: "موريتانيا" },
      { image: "https://i.pinimg.com/564x/69/b2/0a/69b20a2431b0f6105661f1d4d5d7509c.jpg", answer: "كوريا" },
      { image: "https://i.pinimg.com/236x/53/76/b4/5376b4793712faa060cabb4fe8e85b20.jpg", answer: "الصين" },
      { image: "https://i.pinimg.com/564x/8a/40/f6/8a40f62eadc052d92641ec1f32f67053.jpg", answer: "الارجنتين" },
      { image: "https://i.pinimg.com/236x/c8/aa/36/c8aa36dadd87d63233ef72e84aebe694.jpg", answer: "كندا" },
      { image: "https://i.pinimg.com/564x/d3/28/0f/d3280f4c8423cb190eebadd0acc6c88e.jpg", answer: "فرنسا" },
      { image: "https://i.pinimg.com/236x/8f/ef/24/8fef241778c6e4c6bfcdab543567adff.jpg", answer: "امريكا" },
      { image: "https://i.pinimg.com/236x/41/cf/c8/41cfc821d08adfdee59d6a3503ba0c0b.jpg", answer: "لبنان" }
      // يمكن إضافة بقية الدول بنفس الأسلوب
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const correctAnswer = randomQuestion.answer;

    // تحميل الصورة وحفظها مؤقتاً
    const response = await axios.get(randomQuestion.image, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImageFilePath, Buffer.from(response.data, "binary"));

    // إرسال السؤال مع الصورة
    await message.reply({
      body: langData.ar_SY.question,
      attachment: [fs.createReadStream(tempImageFilePath)]
    });

    // انتظار الإجابة
    global.client.handleReply.push({
      name: config.name,
      messageID: message.messageID,
      correctAnswer: correctAnswer,
      Currencies: Currencies,
      langData: langData
    });

  } catch (err) {
    console.error("حدث خطأ في أمر الاعلام:", err);
    message.reply("حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.");
  }
}

export default {
  config,
  langData,
  onCall
};
